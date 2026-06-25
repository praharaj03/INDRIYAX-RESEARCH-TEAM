import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../api/supabase';
import { authService } from './authService';
import { getErrorMessage } from '../../utils/apiMessage';
import BrandLoader from '../../utils/BrandLoader';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // 1. Initial Session Check on Load
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        localStorage.setItem('accessToken', session.access_token);
        try {
          // Fetch extended profile data from the Express backend
          const userData = await authService.getCurrentProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile from backend:', error);
          // If backend fails but Supabase is active, sign out to keep state in sync
          await supabase.auth.signOut();
        }
      }
      setIsInitializing(false);
    };

    initializeAuth();

    // 2. Listen for Auth State Changes (Login, Logout, Token Refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('accessToken', session.access_token);
        try {
          const userData = await authService.getCurrentProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch profile after sign in', error);
        }
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('accessToken');
        setUser(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Keep the Axios interceptor supplied with the latest token
        localStorage.setItem('accessToken', session.access_token);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    const loadingToast = toast.loading('Signing out…');
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(getErrorMessage(error, 'Failed to sign out.'), { id: loadingToast });
    } else {
      toast.success('Successfully logged out.', { id: loadingToast });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isInitializing, logout }}>
      {isInitializing ? <BrandLoader label="Loading IndriyaX…" /> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
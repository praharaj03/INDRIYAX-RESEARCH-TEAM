import { create } from "zustand";

interface User {
  id: string;
  email: string;
  fullName?: string;
  imageUrl?: string;
  role?: string;
}

interface AppStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem("sb_token", token);
    else localStorage.removeItem("sb_token");
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("sb_token");
    set({ user: null, token: null });
  },
}));

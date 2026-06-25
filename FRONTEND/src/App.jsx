import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./utils/ThemeContext";
import { AuthProvider } from "./features/auth/AuthContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Imports
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Profile from "./features/auth/Profile"; // <-- ADDED THIS
import Dashboard from "./features/dashboard/Dashboard";
import CreateEvent from "./features/events/CreateEvent";
import CreatePost from "./features/posts/CreatePost";
import PostList from "./features/posts/PostList";
import PostDetail from "./features/posts/PostDetail";
import EventList from "./features/events/EventList";
import EventDetail from "./features/events/EventDetail";
import AdminEventDetail from "./features/dashboard/AdminEventDetail";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import EditEvent from "./features/events/EditEvent";
import EditPost from "./features/posts/EditPost";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <MainLayout>
            <Routes>
              {/* 1. Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/posts/:slug" element={<PostDetail />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:slug" element={<EventDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* 2. Unauthorized Fallback Route */}
              <Route
                path="/unauthorized"
                element={
                  <div className="text-center py-20 animate-in fade-in">
                    <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                      Access Denied
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                      You do not have the required permissions to view this
                      page. If you believe this is an error, please contact
                      support.
                    </p>
                  </div>
                }
              />

              {/* 3. Protected Routes */}

              {/* Profile Route - Crucial for standard users! */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["USER", "AUTHOR", "ADMIN"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin & Author Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard/events/:eventId"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminEventDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events/create"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/events/:slug/edit"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <EditEvent />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/posts/create"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/posts/:slug/edit"
                element={
                  <ProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
                    <EditPost />
                  </ProtectedRoute>
                }
              />

              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </MainLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

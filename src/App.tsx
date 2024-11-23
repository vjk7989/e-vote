import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import PhotoCapture from './components/PhotoCapture';
import Elections from './components/Elections';
import AdminDashboard from './components/AdminDashboard';
import CreateElection from './components/CreateElection';
import UserManagement from './components/UserManagement';
import UserProfile from './components/UserProfile';
import SystemLogs from './components/SystemLogs';

function PrivateRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const user = useStore((state) => state.user);
  
  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to="/elections" />;
  
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              }
            />
            <Route
              path="/photo-capture"
              element={
                <PrivateRoute>
                  <PhotoCapture />
                </PrivateRoute>
              }
            />
            <Route
              path="/elections"
              element={
                <PrivateRoute>
                  <Elections />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requireAdmin>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <PrivateRoute requireAdmin>
                  <SystemLogs />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute requireAdmin>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/create-election"
              element={
                <PrivateRoute requireAdmin>
                  <CreateElection />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/elections" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import MyBookings from './pages/MyBookings';
import BookingConfirmation from './pages/BookingConfirmation';
import AdminPanel from './pages/AdminPanel';



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/rooms/:id" element={<RoomDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route 
                path="/my-bookings" 
                element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/bookings/:id" 
                element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>

          <Footer />

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#0A0F1C',
                },
                style: {
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#0A0F1C',
                },
                style: {
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
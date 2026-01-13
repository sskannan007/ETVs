import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegistrationPage from './pages/registration.jsx';
import LoginPage from './pages/login.jsx';
import Admin from './pages/Admin';
import './pages/registeration.scss';
import CustomNavbar from './pages/navbar.jsx';
import MainHome from './pages/MainHome.jsx';
import Home from './pages/Home.jsx';
import TTSPage from './pages/TTSPage';
import AdminUserRecords from './pages/AdminUserRecords.jsx';
import UserDetails from './pages/UserDetails';
import ResetPassword from './pages/ResetPassword.jsx';
import TTSUpload from './pages/TTSUpload.jsx';
import BulkUpload from './pages/BulkUpload.jsx';
import SavedRecords from './pages/SavedRecords.jsx';
import TTSRecords from './pages/TTSRecords.jsx';
import TTSHome from './pages/TTSHome.jsx';

function App() {
  useEffect(() => {
    const INACTIVITY_LIMIT = 2 * 60 * 60 * 1000; // 2 hours
    let timeoutId;

    const logoutUser = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/login?reason=timeout';
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      if (localStorage.getItem('token')) {
        timeoutId = setTimeout(logoutUser, INACTIVITY_LIMIT);
      }
    };

    const events = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart', 'visibilitychange'];
    events.forEach(event =>
      window.addEventListener(event, resetTimer, { passive: true })
    );

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  return (
    <>
      <Routes>
        {/* Auth routes */}
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Main routes */}
        <Route path="/" element={<MainHome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bulk-upload" element={<BulkUpload />} />
        <Route path="/tts" element={<TTSPage />} />
        <Route path="/tts-home" element={<TTSHome />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/user-records/:email" element={<AdminUserRecords />} />
        <Route path="/admin/saved-records" element={<SavedRecords />} />
        <Route path="/admin/tts-records" element={<TTSRecords />} />
        <Route path="/admin/users/:userId" element={<UserDetails />} />
        <Route path="/TTSUpload" element={<TTSUpload />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Add placeholder components for Data Validation
const DataValidation = () => (
  <>
    <CustomNavbar />
    <div style={{padding:'2rem',textAlign:'center'}}><h2>Data Validation Page</h2></div>
  </>
);

export default App;
import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle, FaHome, FaUserShield, FaCog, FaSignOutAlt, FaGlobe } from 'react-icons/fa';
import SLogo from '../assets/Asr&tts.png';

const TopNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8000/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          if (user.firstname && user.lastname) {
            setUserName(`${user.firstname} ${user.lastname}`);
          } else {
            setUserName('');
          }
          setRole(user.role);
        } else {
          setUserName('');
        }
      } catch (err) {
        setUserName('');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <>
      <div style={{
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1000,
        padding: '0 2rem',
        boxSizing: 'border-box',
      }}>
      {/* Left: Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={SLogo}
          alt="App Logo"
          style={{ width: 90, height: 90, objectFit: 'contain' }}
        />
      </div>
      
      {/* Right: Logout Button */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {/* Center: Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <NavLink
            to="/home"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{
              color: location.pathname === '/home' ? '#133a60' : '#6c757d',
              fontWeight: location.pathname === '/home' ? 600 : 500,
              textDecoration: 'none',
              margin: '0.75rem',
              paddingBottom: '0.3rem',
              borderBottom: location.pathname === '/home' ? '3px solid #133a60' : '3px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              position: 'relative',
            }}
          >
            <FaHome style={{ fontSize: '1rem' }} /> ASR Home
          </NavLink>

          {role === 'admin' && (
            <NavLink
              to="/bulk-upload"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{
                color: location.pathname === '/bulk-upload' ? '#133a60' : '#6c757d',
                fontWeight: location.pathname === '/bulk-upload' ? 600 : 500,
                textDecoration: 'none',
                margin: '0.75rem',
                paddingBottom: '0.3rem',
                borderBottom: location.pathname === '/bulk-upload' ? '3px solid #133a60' : '3px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
              }}
            >
              <FaGlobe style={{ fontSize: '1rem' }} /> ASR Upload
            </NavLink>
          )}

          {role === 'admin' && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{
                color: location.pathname === '/admin' ? '#133a60' : '#6c757d',
                fontWeight: location.pathname === '/admin' ? 600 : 500,
                textDecoration: 'none',
                margin: '0.75rem',
                paddingBottom: '0.3rem',
                borderBottom: location.pathname === '/admin' ? '3px solid #133a60' : '3px solid transparent',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
              }}
            >
              <FaUserShield style={{ fontSize: '1rem' }} /> ASR Records
            </NavLink>
          )}
        </nav>
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '2px solid #000',
            cursor: 'pointer',
            fontSize: '1.1rem',
            fontWeight: '500',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            padding: 8,
            borderRadius: '8px'
          }}
          title="Logout"
        >
          Logout
        </button>
      </div>
    </div>

    {/* CSS for nav-link hover effects */}
    <style>{`
      .nav-link:hover {
        color: #133a60 !important;
        border-bottom-color: #133a60 !important;
      }
      .nav-link.active {
        color: #133a60 !important;
        font-weight: 600 !important;
        border-bottom-color: #133a60 !important;
      }
    `}</style>
    </>
  );
};

export default TopNavbar;
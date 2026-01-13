import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaHome, FaMicrophone, FaVolumeUp } from 'react-icons/fa';
import textToSpeechLogo from '../../assets/Asr&tts.png';

const getInitials = (firstname, lastname) => {
  if (!firstname && !lastname) return '';
  if (firstname && !lastname) return firstname[0].toUpperCase();
  if (!firstname && lastname) return lastname[0].toUpperCase();
  return (firstname[0] + lastname[0]).toUpperCase();
};

const navLinkStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.6rem 0.9rem',
  borderRadius: '10px',
  textDecoration: 'none',
  color: isActive ? '#fff' : '#6c757d',
  backgroundColor: isActive ? '#133a60' : 'transparent',
  transition: 'all 0.2s ease',
  fontWeight: 500
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const SideNavbar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Check if current path is ASR-related
  const isASRPage = () => {
    const asrPaths = ['/home', '/bulk-upload', '/admin/saved-records'];
    return asrPaths.includes(location.pathname);
  };

  // Check if current path is TTS-related
  const isTTSPage = () => {
    const ttsPaths = ['/tts-home', '/TTSUpload', '/admin/tts-records'];
    return ttsPaths.includes(location.pathname);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const user = await res.json();
          setFirstname(user.firstname || '');
          setLastname(user.lastname || '');
        }
      } catch (err) {
        setFirstname('');
        setLastname('');
      }
    };
    fetchUser();
  }, []);



  return (
    <div
      className="text-white p-3 sideNavbar kannan"
      style={{ width: '250px', position: 'fixed', top: 0, left: 0, backgroundColor: '#f2f6fe', minHeight: '100vh', zIndex: 1000, borderRight: '1px solid #e0e0e0', boxShadow: '2px 0 8px rgba(0,0,0,0.1)' }}
    >
      {/* Logo/Header */}
      <div className="text-center pb-2 border-bottom" style={{ borderColor: '#e0e0e0 !important' }}>
        <img
          src={textToSpeechLogo}
          alt="ETV Text to Speech"
          style={{ maxWidth: '120px', width: '100%', height: 'auto' }}
        />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
        <NavLink to="/" style={navLinkStyle(location.pathname === '/')}>
          <FaHome style={{ fontSize: '1.1rem' }} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/home" style={navLinkStyle(isASRPage())}>
          <FaMicrophone style={{ fontSize: '1.1rem' }} />
          <span>ASR Dashboard</span>
        </NavLink>

        <NavLink to="/tts-home" style={navLinkStyle(isTTSPage())}>
          <FaVolumeUp style={{ fontSize: '1.1rem' }} />
          <span>TTS Dashboard</span>
        </NavLink>
      </nav>
      {/* User Profile at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem'
        }}
      >
        <button
          type="button"
          onClick={() => setShowProfileMenu(prev => !prev)}
          style={{
            width: '100%',
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#133A60',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            {getInitials(firstname, lastname) || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <div style={{ fontSize: '0.9rem', color: '#133a60', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {firstname && lastname ? `${firstname} ${lastname}` : 'User'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '2px' }}>Online</div>
          </div>
        </button>
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#133A60',
              borderRadius: '12px',
              border: '1px solid #133a60',
              boxShadow: '0 20px 60px rgba(15,23,42,0.15)',
              padding: '0.5rem',
              width: '180px',
              zIndex: 1200
            }}
          >
            <Button
              variant="link"
              className="w-100 text-start"
              style={{ textDecoration: 'none', color: '#ffffffff', fontWeight: 600 }}
              onClick={() => {
                setShowProfileMenu(false);
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                navigate('/login');
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>

      <style>{`
        .side-nav-link:hover {
          background: #133a60 !important;
          color: #fff !important;
        }
        .side-nav-link.active {
          background: #133a60 !important;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default SideNavbar; 
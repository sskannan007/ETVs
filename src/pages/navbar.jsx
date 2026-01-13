import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaHome, FaInfoCircle, FaComments, FaTasks, FaUserShield, FaAngleDoubleLeft, FaAngleDoubleRight, FaCog, FaSignOutAlt } from 'react-icons/fa';
import SLogo from '../assets/S.png';

const menuItems = [
  { to: "/home", label: "Home", icon: <FaHome /> },
  { to: "/about", label: "About", icon: <FaInfoCircle /> },
  { to: "/feedback", label: "Feedback", icon: <FaComments /> },
  { to: "/data-validation", label: "Data Validation", icon: <FaTasks /> },
  { to: "/admin", label: "Admin", icon: <FaUserShield /> },
];

const SideNavbar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userName, setUserName] = useState('');
  const profileRef = useRef(null);

  
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Fetch user info on mount
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
          console.log('Fetched user:', user);
          if (user.firstname && user.lastname) {
            setUserName(`${capitalize(user.firstname)} ${capitalize(user.lastname)}`);
          } else {
            setUserName('');
          }
        } else {
          setUserName('');
        }
      } catch (err) {
        setUserName('');
        console.log(userName)
      }
      console.log(user)
    };
    fetchUser();
  }, []);

  // Logout handler
  const handleLogout = () => {
    setShowProfileMenu(false);
    localStorage.removeItem('token');
    setTimeout(() => {
      window.location.href = '/login';
    }, 100);
  };

  // Close popup when clicking outside
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


  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

    return (
    <div style={{
      width: collapsed ? '70px' : '240px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      background: '#f8f9fa',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 1000,
      transition: 'width 0.2s',
    }}>
      {/* Top: Logo/App Name and Collapse Button */}
      <div style={{ padding: collapsed ? '1.5rem 0.5rem 1rem 0.5rem' : '2rem 1rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'flex-start' }}>
        {collapsed ? (
          <>
            <div style={{ textAlign: 'center', width: '100%', marginBottom: 0 }}>
              <img
                src={SLogo}
                alt="App Logo"
                style={{
                  width: 32,
                  height: 32,
                  objectFit: 'contain',
                  transition: 'width 0.2s, height 0.2s'
                }}
              />
            </div>
            <button
                className= 'arrow-icon'
              onClick={() => setCollapsed(c => !c)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2rem',
                alignSelf: 'center',
                fontSize: '1.2rem',
                color: '#000000',
                transition: 'transform 0.2s',
              }}
              aria-label="Expand sidebar"
            >
              <FaAngleDoubleRight />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '2rem', gap: '1.5rem' }}>
            <img
              src={SLogo}
              alt="App Logo"
              style={{
                width: 80,
                height: 80,
                objectFit: 'contain',
                transition: 'width 0.2s, height 0.2s'
              }}
            />
            <button
                className= 'arrow-icon'
              onClick={() => setCollapsed(c => !c)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.6rem',
                color: '#000000',
                transition: 'transform 0.2s',
              }}
              aria-label="Collapse sidebar"
            >
              <FaAngleDoubleLeft />
            </button>
          </div>
        )}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
          <style>{`
            .sidebar-nav-link {
              display: flex;
              align-items: center;
              gap: 1rem;
              color: #222;
              text-decoration: none;
              font-weight: 500;
              font-size: 1.1rem;
              border-radius: 8px;
              padding: 0.7rem 1.2rem;
              margin: 0 -0.5rem;
              transition: all 0.2s;
              justify-content: flex-start;
              background: none;
            }
            .sidebar-nav-link.active, .sidebar-nav-link:hover {
              background: #0505050a;
              color: #000000;
              font-weight: 700;
            }
          `}</style>
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
              style={{
                padding: collapsed ? '0.7rem 0.7rem' : '0.7rem 1.2rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
              title={item.label}
            >
              {item.icon}
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Bottom: User Avatar/Placeholder with Popup */}
      <div style={{ padding: collapsed ? '1.5rem 0.5rem' : '2rem 1rem', textAlign: 'center', transition: 'padding 0.2s', position: 'relative' }}>
        <div
          ref={profileRef}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => setShowProfileMenu((v) => !v)}
        >
          <div style={{
            width: collapsed ? 32 : 44,
            height: collapsed ? 32 : 44,
            borderRadius: '50%',
            background: '#1976d2',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: collapsed ? '1.1rem' : '1.2rem',
            fontWeight: 600,
            marginRight: !collapsed ? 0 : 0,
            userSelect: 'none',
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}>{getInitials(userName || 'U')}</div>
          {!collapsed && <div style={{ fontSize: '0.95rem', color: '#000', marginTop: '0', marginLeft: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{userName || 'User'}</div>}
        </div>
        {showProfileMenu && (
          <div style={{
            position: 'absolute',
            bottom: collapsed ? '60px' : '6rem',
            right: collapsed ? '-9rem' : '-2rem',
            transform: collapsed ? 'translateX(-50%)' : 'none',
            background: '#fff',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            borderRadius: '10px',
            minWidth: collapsed ? '120px' : '180px',
            zIndex: 2000,
            padding: '0.5rem 0',
            textAlign: 'left',
          }}>
            <style>{`
              .profile-menu-item {
                display: flex;
                align-items: center;
                gap: 0.7rem;
                padding: 0.7rem 1.2rem;
                cursor: pointer;
                font-weight: 500;
                color: #222;
                border-radius: 6px;
                transition: background 0.2s, color 0.2s;
              }
              .profile-menu-item:hover {
                background: #0505050a;
                color: #000000;
              }
              .profile-menu-item.logout {
                color: #d32f2f;
              }
              .profile-menu-item.logout:hover {
                background: #ffeaea;
                color: #b71c1c;
              }
            `}</style>
            <div
              className="profile-menu-item"
              onClick={() => { setShowProfileMenu(false); /* Add settings navigation here if needed */ }}
            >
              <FaCog /> Settings
            </div>
            <div
              className="profile-menu-item logout"
              onMouseDown={handleLogout}
            >
              <FaSignOutAlt /> Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideNavbar;

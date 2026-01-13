import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const menuConfig = {
  'home': {
    heading: 'Home',
    items: [
      { path: '/history', label: 'History' }
    ]
  },
  'data-validation': {
    heading: 'Data Validation',
    items: [
      { path: '/data-validation/about-cag', label: 'Validation' }
    ]
  },
  'admin': {
    heading: 'Admin Panel',
    items: [
      { path: '/admin', label: 'Users', end: true },
      { path: '/admin/example1', label: 'Example 1' },
      { path: '/admin/example2', label: 'Example 2' }
    ]
  }
};

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const sidebarRef = useRef(null);
  const location = useLocation();

  // Determine which menu to show based on current path
  let currentMenu = 'data-validation';
  if (location.pathname === '/' || location.pathname.startsWith('/home')) {
    currentMenu = 'home';
  } else if (location.pathname.includes('/admin')) {
    currentMenu = 'admin';
  }
  const { heading, items } = menuConfig[currentMenu];

  // Collapse sidebar on click outside or Escape key
  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isSidebarOpen, toggleSidebar]);

  return (
    <>
      {/* Hamburger icon for collapse/expand, only show when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="menu-btn" style={{ position: 'fixed', top: 85, left: 0, zIndex: 1000, width: '50px', height: '100%', backgroundColor: '#031d39', borderRadius: '0px' }}>
          <button
            className="btn btn-dark menu-btn"
            style={{background: 'transparent'}}
            onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>
      )}
      {/* Sidebar */}
      {isSidebarOpen && (
        <div
          ref={sidebarRef}
          className="text-white p-3 sideNavbar suresh navbar-open "
          style={{ width: '280px', position: 'fixed', top: 85, left: 0, backgroundColor: '#031d39', minHeight: '100vh', zIndex: 1100 }}
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>{heading}</h5>
            <FaBars onClick={toggleSidebar} style={{ cursor: 'pointer' }} />
          </div>
          <nav className="flex-column">
            {items.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `nav-link text-white mb-3${isActive ? ' active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar; 
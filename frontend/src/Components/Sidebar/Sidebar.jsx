import React, { useState } from 'react';
import { menu } from './SidebarConfig.js';
import { useNavigate } from 'react-router-dom';
import insta from './insta2.png';
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen = false, toggleSidebar = () => {} }) => {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();

  const handleTabClick = (title) => {
    setActiveTab(title);
    if (title === 'Profile') {
      navigate(`/${localStorage.getItem('userName') || 'user'}`);
    } else if (title === 'Home') {
      navigate('/feed');
    } else if (title === 'Create') {
      navigate('/create');
    } else if (title === 'Bloggers') {
      navigate('/others');
    } else if (title === 'Logout') {
      // Clear localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('bio');
      localStorage.removeItem('token');
      // Reset active tab and navigate to root
      setActiveTab(null);
      navigate('/');
    }
    // Close sidebar on mobile after clicking a menu item
    if (isSidebarOpen) {
      toggleSidebar(); // Close if open
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-logo">
          <img src={insta} alt="logo" />
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <div className="sidebar-menu">
          {menu.map((item, index) => (
            <div
              key={index}
              className={`menu-item ${activeTab === item.title ? 'active' : ''}`}
              onClick={() => handleTabClick(item.title)}
            >
              <div className="menu-icon">
                {activeTab === item.title ? item.activeIcon : item.icon}
              </div>
              <span className={activeTab === item.title ? 'font-bold' : 'font-semibold'}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { menu } from './SidebarConfig.js';
import { useNavigate } from 'react-router-dom';
import insta from './insta2.png';
import './Sidebar.css'; 

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState();
  const navigate = useNavigate();
  
  const handleTabClick = (title) => {
    setActiveTab(title);
    if(title === "Profile") {
      navigate(`/${localStorage.getItem('userName')}`);
    }
    else if(title === "Home") {
      navigate("/");
    }
    else if(title ==="Create"){
      navigate("/create")
    }
    else if(title ==="Bloggers"){
      navigate("/others")
    }
  }
  
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <div className="sidebar-logo">
          <img src={insta} alt="logo" />
        </div>
        
        {/* Menu Items */}
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
              <span className={activeTab === item.title ? "font-bold" : "font-semibold"}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - More
      <div className="sidebar-footer">
        <div className="menu-item">
          <div className="menu-icon">
            <IoReorderFourSharp />
          </div>
          <span>More</span>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
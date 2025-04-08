import React, { useState } from 'react';
import { IoReorderFourSharp } from "react-icons/io5";
import { menu } from './SidebarConfig.js';
import { useNavigate } from 'react-router-dom';
import insta from './insta2.png'
const Sidebar = () => {
  const [activeTab,setActiveTab]=useState();
  const navigate = useNavigate();
  const handleTabClick=(title)=>{
    setActiveTab(title)
    if(title==="Profile"){
      navigate("/username");
    }
    else if(title==="Home"){
      navigate("/");
    }
  }
  return (
    <div 
      style={{
        position: 'sticky',
        top: 0,
        left:0,
        height: '100vh',
        width: '256px',
        borderRight: '2px solid #e6e6e6',
        backgroundColor: '#F1F0E9',
        display: 'flex',
        flexDirection: 'column',
        // overflow: 'hidden', // Prevent overflow issues
        overflow:'y-auto',
        padding:'4px'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 32px 0px' }}>
          <img 
            style={{ width: '500px', objectFit: 'contain' }}
            src={insta} 
            alt="logo" 
          />
        </div>
        
        {/* Menu Items */}
        <div style={{ padding: '0 8px', flex: '1 0 auto', overflowY: 'auto' }}>
          {menu.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginBottom: '8px',
                padding: '8px 0px',
                cursor: 'pointer',
                fontSize: '16px',
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s',
                borderRadius: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#BDB398')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              onClick={()=>handleTabClick(item.title)}
            >
              <div style={{ fontSize: '24px', marginRight: '16px', flexShrink: 0 }}>
                {activeTab===item.title? item.activeIcon:item.icon}
              </div>
              <span className={`${activeTab===item.title?"font-bold":"font-semibold"}`}>
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section - More */}
      <div style={{ padding: '0 8px 16px 8px' }}>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '8px 0px',
            cursor: 'pointer',
            fontSize: '16px',
            backgroundColor: 'transparent',
            transition: 'background-color 0.2s',
            borderRadius: '8px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f2f2f2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <div style={{ fontSize: '24px', marginRight: '16px', flexShrink: 0 }}>
            <IoReorderFourSharp />
          </div>
          <span style={{ fontWeight: 500, color: '#262626' }}>
            More
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
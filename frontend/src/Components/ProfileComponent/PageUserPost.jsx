import React, { useState } from 'react';
import { AiOutlineTable, AiOutlineUser } from 'react-icons/ai';
import { BiBookmark } from 'react-icons/bi';
import PageUserPostCard from './PageUserPostCard'; 
import './ProfileComponent.css'
const PageUserPost = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0); 

  const tabs = [
    {
      tab: 'Post',
      icon: <AiOutlineTable />,
      activeTab: false,
    },
    {
      tab: 'Saved',
      icon: <BiBookmark />,
      activeTab: false,
    },
    {
      tab: 'Tagged',
      icon: <AiOutlineUser />,
      activeTab: false,
    },
  ];

  return (
    <div className='ContentWrapper'>
      <div className='DividerContainer'>
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTabIndex(index)}
            className="ActiveTab" style={{ fontWeight: index === activeTabIndex ? '600' : '400' }}
            onMouseOver={(e) => (e.target.style.color = '#00376b')}
            onMouseOut={(e) => (e.target.style.color = '#262626')}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.tab}</span>
            {index === activeTabIndex && (
              <span className="ActiveTabIndicator"/>
            )}
          </div>
        ))}
      </div>

      <div className='BlogContainer'>
        {[1, 1, 1, 1, 1, 1].map((item, index) => (
          <PageUserPostCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default PageUserPost;
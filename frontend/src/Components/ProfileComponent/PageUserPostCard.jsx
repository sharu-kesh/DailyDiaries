import React from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FaRegCommentAlt } from 'react-icons/fa';
import './ProfileComponent.css'

const PageUserPostCard = () => {
  return (
    <div
      style={{
        width: 'calc(33.33% - 0.666rem)',
        aspectRatio: '1 / 1',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'filter 0.2s ease',
        }}
        src="https://cdn.pixabay.com/photo/2024/09/15/13/03/cows-9049119_640.jpg"
        alt=""
      />
      <div className='OverlayContent'>
        <div className='Likes'>
          <AiFillHeart style={{ fontSize: '1.2rem' }} />
          <span style={{ fontSize: '1rem' }}>10</span>
        </div>
        <div className='Comments'>
          <FaRegCommentAlt style={{ fontSize: '1.2rem' }} />
          <span style={{ fontSize: '1rem' }}>30</span>
        </div>
      </div>
      <div
        className='OverlayBackground'
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; 
          e.currentTarget.previousSibling.style.opacity = 1; 
          e.currentTarget.previousSibling.previousSibling.style.filter = 'brightness(0.7)'; 
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0)'; 
          e.currentTarget.previousSibling.style.opacity = 0; 
          e.currentTarget.previousSibling.previousSibling.style.filter = 'brightness(1)'; 
        }}
      />
    </div>
  );
};

export default PageUserPostCard;
import React,{useState} from 'react';
import { TbCircleDashed } from 'react-icons/tb';
import ProfileEditModal from './ProfileEditModal';

export const ProfileUserDetails = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: localStorage.getItem('userName') || "instagram_user",
    bio: localStorage.getItem('bio') || "Coffee addict | Photography lover | Hiking enthusiast",
    profilePicture: "/api/placeholder/150/150" // Replace with your image path
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (updatedData) => {
    setIsModalOpen(false);
    
    // If data was passed back, update the user data
    if (updatedData) {
      setUserData(updatedData);
    }
  };
  
  return (
    <div style={{ padding: '50px 0 40px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
      {/* Profile Picture */}
      <div style={{ width: '10rem', height: '10rem', overflow: 'hidden', borderRadius: '50%', marginRight: '1rem', position: 'relative', zIndex: 1 }}>
        <img
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://cdn.pixabay.com/photo/2024/10/16/16/14/cat-9125207_640.jpg"
          alt="Profile Pic"
        />
      </div>

      {/* All Content to the Right (Centered) */}
      <div style={{ flex: 1, maxWidth: '600px', position: 'relative', zIndex: 2 }}>
        {/* Username, Edit Profile, and Icon */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', justifyContent: 'center' }}>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937', marginRight: '1rem' }}>{userData.username}</p>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3B82F6',
              color: 'white',
              borderRadius: '0.375rem',
              marginRight: '1rem',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#2563EB')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#3B82F6')}
            onClick={handleEditClick}
          >
            Edit Profile
          </button>
          <TbCircleDashed
            style={{ fontSize: '1.5rem', color: '#4B5563', cursor: 'pointer' }}
            onMouseOver={(e) => (e.target.style.color = '#1F2937')}
            onMouseOut={(e) => (e.target.style.color = '#4B5563')}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center', marginRight: '2rem' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>12</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Posts</p>
          </div>
          <div style={{ textAlign: 'center', marginRight: '2rem' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>1.2K</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Followers</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>150</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Following</p>
          </div>
        </div>

        {/* Bio */}
        <div style={{ textAlign: 'center' }}>
          <p className='font-semibold' style={{ color: '#4B5563', fontSize: '1rem' }}>
            {userData.bio}
          </p>
        </div>
      </div>
      <ProfileEditModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialUserData={userData} 
      />
    </div>
  );
};
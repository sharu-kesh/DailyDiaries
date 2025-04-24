import React, { useState, useEffect } from 'react';
import { TbCircleDashed } from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileEditModal from './ProfileEditModal';
import { BASEURL } from '../../constants';

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

export const ProfileUserDetails = () => {
  const { username } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: localStorage.getItem('userName') || 'instagram_user',
    bio: localStorage.getItem('bio') || 'Coffee addict | Photography lover | Hiking enthusiast',
    profilePicture: '/api/placeholder/150/150',
  });
  const [blogCount, setBlogCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingsCount, setFollowingsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = (updatedData) => {
    setIsModalOpen(false);
    if (updatedData) {
      setUserData(updatedData);
      localStorage.setItem('userName', updatedData.username);
      localStorage.setItem('bio', updatedData.bio);
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        setError('Please log in to view profile details');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Fetch blog count
        const blogResponse = await axios.get(`${BASEURL}/blogs/${userId}/getBlogsCount`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Auth-User-Id': userId,
          },
        });
        if (blogResponse?.status !== 200) {
          throw new Error('Failed to fetch blog count');
        }
        console.log(blogResponse)
        setBlogCount(blogResponse.data || 0);

        // Fetch follower count
        const followerResponse = await axios.get(`${BASEURL}/feed/getFollowers`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Auth-User-Id': userId,
          },
        });
        if (followerResponse?.status !== 200) {
          throw new Error('Failed to fetch follower count');
        }
        
        setFollowerCount(followerResponse.data || 0);

        // Fetch followings count
        const followingsResponse = await axios.get(`${BASEURL}/feed/getFollowings`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Auth-User-Id': userId,
          },
        });
        if (followingsResponse?.status !== 200) {
          throw new Error('Failed to fetch followings count');
        }
        
        setFollowingsCount(followingsResponse.data || 0);
      } catch (err) {
        console.error('Error fetching profile counts:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div
      style={{
        padding: '50px 0 40px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      {/* Profile Picture */}
      <div
        style={{
          width: '10rem',
          height: '10rem',
          overflow: 'hidden',
          borderRadius: '50%',
          marginRight: '1rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          src="https://cdn.pixabay.com/photo/2024/10/16/16/14/cat-9125207_640.jpg"
          alt="Profile Pic"
        />
      </div>

      {/* All Content to the Right (Centered) */}
      <div style={{ flex: 1, maxWidth: '600px', position: 'relative', zIndex: 2 }}>
        {/* Username, Edit Profile, and Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#1F2937',
              marginRight: '1rem',
            }}
          >
            {userData.username}
          </p>
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

        {/* Counts */}
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#6B7280', marginBottom: '1rem' }}>
            Loading profile details...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#D32F2F', marginBottom: '1rem' }}>
            Error: {error}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <div style={{ textAlign: 'center', marginRight: '2rem' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
                {formatCount(blogCount)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Blogs</p>
            </div>
            <div style={{ textAlign: 'center', marginRight: '2rem' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
                {formatCount(followerCount)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Followers</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#374151' }}>
                {formatCount(followingsCount)}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>Following</p>
            </div>
          </div>
        )}

        {/* Bio */}
        <div style={{ textAlign: 'center' }}>
          <p className="font-semibold" style={{ color: '#4B5563', fontSize: '1rem' }}>
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
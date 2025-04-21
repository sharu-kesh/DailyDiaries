import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';

const ProfileEditModal = ({ isOpen, onClose, initialUserData }) => {
  const [userData, setUserData] = useState(initialUserData || {
    username: "johndoe123",
    bio: "Travel enthusiast | Food lover | Software Engineer",
    profilePicture: "/api/placeholder/150/150"
  });
  
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef(null);
  
  if (!isOpen) return null;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };
  
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload this file to a server
      // For this example, we'll just create a local URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserData({ ...userData, profilePicture: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    console.log("Updated profile data:", userData);
    onClose(userData); // Close modal and pass back updated data
  };

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '400px',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 16px',
      borderBottom: '1px solid #efefef'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      flex: 1,
      textAlign: 'center'
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px'
    },
    form: {
      padding: '20px'
    },
    profilePictureSection: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px'
    },
    profilePictureWrapper: {
      position: 'relative',
      width: '78px',
      height: '78px',
      borderRadius: '50%',
      overflow: 'hidden',
      marginRight: '20px',
      cursor: 'pointer'
    },
    profilePicture: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    profilePictureOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
    pictureHint: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#0095f6',
      cursor: 'pointer'
    },
    formGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontWeight: '500',
      fontSize: '14px',
      color: '#262626',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '10px 8px',
      fontSize: '14px',
      border: '1px solid #dbdbdb',
      borderRadius: '4px',
      backgroundColor: '#fafafa'
    },
    textarea: {
      width: '100%',
      padding: '10px 8px',
      fontSize: '14px',
      border: '1px solid #dbdbdb',
      borderRadius: '4px',
      backgroundColor: '#fafafa',
      minHeight: '80px',
      resize: 'vertical'
    },
    submitButton: {
      backgroundColor: '#0095f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '7px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      marginTop: '10px'
    },
    hoverOverlay: {
      opacity: 1
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.header}>
          <div></div> {/* Empty div for spacing */}
          <div style={modalStyles.title}>Edit Profile</div>
          <button style={modalStyles.closeButton} onClick={() => onClose()}>
            <X size={20} />
          </button>
        </div>
        
        <form style={modalStyles.form} onSubmit={handleSubmit}>
          <div style={modalStyles.profilePictureSection}>
            <div 
              style={modalStyles.profilePictureWrapper}
              onClick={handleImageClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <img 
                src={userData.profilePicture} 
                alt="Profile" 
                style={modalStyles.profilePicture} 
              />
              <div style={{
                ...modalStyles.profilePictureOverlay,
                opacity: isHovering ? 1 : 0
              }}>
                <Camera color="white" size={24} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
            </div>
            <div style={modalStyles.pictureHint} onClick={handleImageClick}>
              Change profile photo
            </div>
          </div>
          
          <div style={modalStyles.formGroup}>
            <label htmlFor="username" style={modalStyles.label}>Username</label>
            <input 
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              style={modalStyles.input}
            />
          </div>
          
          <div style={modalStyles.formGroup}>
            <label htmlFor="bio" style={modalStyles.label}>Bio</label>
            <textarea 
              id="bio"
              name="bio"
              value={userData.bio}
              onChange={handleInputChange}
              style={modalStyles.textarea}
              placeholder="Write a short bio..."
            />
          </div>
          
          <button type="submit" style={modalStyles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
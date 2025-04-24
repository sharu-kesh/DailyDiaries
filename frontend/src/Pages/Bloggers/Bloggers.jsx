import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // For linking to blogger profiles or blog posts
import avatar from '../../Components/LandingPage/avatar.jpg'; // Reuse the avatar image from your LandingPage.jsx
import './Bloggers.css'
const Bloggers = () => {
  // Placeholder data for bloggers (replace with API data later)
  const [bloggers, setBloggers] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      profilePhoto: avatar,
      recentPost: {
        title: 'My Bio is myself read from me',
        followers: '12K',
        blogs : '12'
      },
      isFollowing: false,
    },
    {
      id: 2,
      name: 'Alex Brown',
      profilePhoto: avatar,
      recentPost: {
        title: 'My Bio is myself read from me',
        followers: '15K',
        blogs : '20'
      },
      isFollowing: false,
    },
  ]);

  // Function to toggle follow status
  const handleFollowToggle = (bloggerId) => {
    setBloggers((prevBloggers) =>
      prevBloggers.map((blogger) =>
        blogger.id === bloggerId
          ? { ...blogger, isFollowing: !blogger.isFollowing }
          : blogger
      )
    );
  };

  return (
    <div className="bloggers-container">
      <h2 className="bloggers-title">Explore Other Bloggers</h2>
      <div className="bloggers-list">
        {bloggers.map((blogger) => (
          <div key={blogger.id} className="blogger-card">
            <div className="blogger-info">
              <img
                src={blogger.profilePhoto}
                alt={blogger.name}
                className="blogger-photo"
              />
              <div className="blogger-details">
                <Link to={`/profile/${blogger.id}`} className="blogger-name">
                  {blogger.name}
                </Link>
                <button
                  className={`follow-button ${blogger.isFollowing ? 'following' : ''}`}
                  onClick={() => handleFollowToggle(blogger.id)}
                >
                  {blogger.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
            <div className="recent-post">
              <Link to={`/blog/${blogger.id}`} className="post-title">
                {blogger.recentPost.title}
              </Link>
              <p className="post-excerpt">{blogger.recentPost.followers} followers {blogger.recentPost.blogs} blogs</p>
              {/* <span className="post-date">{blogger.recentPost.blogs} blogs</span> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bloggers;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import avatar from '../../Components/LandingPage/avatar.jpg';
import './Bloggers.css';
import { BASEURL } from '../../constants';

const Bloggers = () => {
  const [bloggers, setBloggers] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loadingRef = useRef(null);

  // Fetch initial bloggers from API
  useEffect(() => {
    const fetchBloggers = async () => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        setError('Please log in to view bloggers');
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${BASEURL}/users?page=${page}&size=2`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            'X-Auth-User-Id': userId,
          },
        });

        if (response?.status !== 200) {
          throw new Error('Failed to fetch bloggers');
        }

        const users = response.data.content || response.data || [];
        const mappedBloggers = users.map((user) => ({
          id: user.id,
          name: user.username,
          profilePhoto: avatar,
          bio: user.bio || 'No bio available',
          followers: user.followersCount || 0,
          blogs: user.blogsCount || 0,
          followings: user.followingsCount || 0,
          isFollowing: false,
        }));

        setBloggers((prev) => [...prev, ...mappedBloggers]);
        setHasMore(users.length > 0 && response.data.pageable.pageNumber < response.data.totalPages - 1);
        setPage((prev) => prev + 1);
      } catch (err) {
        console.error('Error fetching bloggers:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBloggers();
  }, []); // Empty dependency array for initial fetch

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadMoreBloggers();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [isLoading, hasMore]);

  // Load more bloggers
  const loadMoreBloggers = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setError('Please log in to view more bloggers');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(`${BASEURL}/users?page=${page}&size=2`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Auth-User-Id': userId,
        },
      });

      if (response?.status !== 200) {
        throw new Error('Failed to fetch more bloggers');
      }

      const users = response.data.content || response.data || [];
      const mappedBloggers = users.map((user) => ({
        id: user.id,
        name: user.username,
        profilePhoto: avatar,
        bio: user.bio || 'No bio available',
        followers: user.followersCount || 0,
        blogs: user.blogsCount || 0,
        followings: user.followingsCount || 0,
        isFollowing: false,
      }));

      setBloggers((prev) => [...prev, ...mappedBloggers]);
      setHasMore(users.length > 0 && response.data.pageable.pageNumber < response.data.totalPages - 1);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error('Error fetching more bloggers:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle follow/unfollow toggle
  const handleFollowToggle = async (bloggerId) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId || !token) {
      setError('Please log in to follow/unfollow bloggers');
      return;
    }

    const blogger = bloggers.find((b) => b.id === bloggerId);
    const willFollow = !blogger.isFollowing;

    // Optimistically update UI
    setBloggers((prevBloggers) =>
      prevBloggers.map((b) =>
        b.id === bloggerId ? { ...b, isFollowing: willFollow } : b
      )
    );

    try {
      if (willFollow) {
        await axios.post(
          `${BASEURL}/feed/${bloggerId}/follow`, {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Auth-User-Id': userId,
            },
          }
        );
      } else {
        await axios.post(
          `${BASEURL}/feed/${bloggerId}/unfollow`, {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'X-Auth-User-Id': userId,
            },
          }
        );
      }
    } catch (err) {
      console.error('Error toggling follow:', err.message);
      // Revert optimistic update on error
      setBloggers((prevBloggers) =>
        prevBloggers.map((b) =>
          b.id === bloggerId ? { ...b, isFollowing: !willFollow } : b
        )
      );
      setError('Failed to update follow status');
    }
  };

  return (
    <div className="bloggers-container">
      <h2 className="bloggers-title">Explore Other Bloggers</h2>
      {isLoading && bloggers.length === 0 && <div className="loading">Loading bloggers...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!isLoading && !error && bloggers.length === 0 && (
        <div className="no-bloggers">No bloggers found.</div>
      )}
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
              <p className="post-title">{blogger.bio}</p>
              <p className="post-excerpt">
                {blogger.followers} followers • {blogger.blogs} blogs
              </p>
            </div>
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={loadingRef} className="loading">
          {isLoading && 'Loading more bloggers...'}
        </div>
      )}
      {!hasMore && bloggers.length > 0 && (
        <div className="end-of-feed">No more bloggers to show</div>
      )}
    </div>
  );
};

export default Bloggers;

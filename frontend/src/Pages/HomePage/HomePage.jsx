import React, { useState, useEffect, useRef, useCallback } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../../constants';
import techImg from './tech.jpg'
import avatar from './avatar.jpg'
const BlogFeed = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('for-you');
  const [articles, setArticles] = useState([]);
  const [userLikes, setUserLikes] = useState({});
  const [userBookmarks, setUserBookmarks] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentSections, setShowCommentSections] = useState({});
  const [currentUser] = useState({
    name: localStorage.getItem('userName') || 'Anonymous',
    avatar: avatar,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Reference for intersection observer
  const loadingRef = useRef(null);

  const computeReadTime = (content) => {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text.split(' ').filter((word) => word.length > 0);
    const count = words.length;
    const minutes = Math.ceil(count / 200);
    return `${minutes} min read`;
  };

  const handleArticleClick = (articleId) => {
    const selectedArticle = articles.find((article) => article.id === parseInt(articleId));
    navigate(`/article/${articleId}`, { state: { article: selectedArticle } });
  };

  // Initialize states for user interactions based on articles
  const initializeInteractionStates = (newArticles) => {
    const newLikes = { ...userLikes };
    const newBookmarks = { ...userBookmarks };
    const newCommentInputs = { ...commentInputs };
    const newCommentSections = { ...showCommentSections };

    newArticles.forEach((article) => {
      if (!(article.id in newLikes)) newLikes[article.id] = false;
      if (!(article.id in newBookmarks)) newBookmarks[article.id] = false;
      if (!(article.id in newCommentInputs)) newCommentInputs[article.id] = '';
      if (!(article.id in newCommentSections)) newCommentSections[article.id] = false;
    });

    setUserLikes(newLikes);
    setUserBookmarks(newBookmarks);
    setCommentInputs(newCommentInputs);
    setShowCommentSections(newCommentSections);
  };

  // Fetch initial data
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const url = `${BASEURL}/feed?page=${page}&size=3`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response?.status !== 200) {
          throw new Error('Failed to fetch blogs');
        }

        const blogs = response.data.content || [];
        const mappedArticles = blogs.map((blog) => ({
          id: blog.id,
          title: blog.title,
          subtitle: blog.subtitle,
          image: blog.titleImage || techImg,
          publication: 'MyBlogPlatform',
          readingTime: computeReadTime(blog.content),
          author: blog.username,
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          views: 0,
          comments: 0,
          commentsList: [],
          verified: Math.random() >= 0.5,
          content: blog.content,
          likes: '0',
          likesCount: 0,
        }));

        setArticles(mappedArticles);
        initializeInteractionStates(mappedArticles);
        setPage((prev) => prev + 1);
        setHasMore(blogs.length > 0);
      } catch (err) {
        console.error('Error fetching blogs:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Function to load more data
  const loadMoreArticles = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const url = `${BASEURL}/feed?page=${page}&size=3`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('Loading more articles:', { page, response });

      if (response?.status !== 200) {
        throw new Error('Failed to fetch blogs');
      }

      const blogs = response.data.content || [];
      const newArticles = blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        subtitle: blog.subtitle,
        image: blog.titleImage || techImg,
        publication: 'MyBlogPlatform',
        readingTime: computeReadTime(blog.content),
        author: blog.username,
        date: new Date(blog.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        views: 0,
        comments: 0,
        commentsList: [],
        verified: Math.random() >= 0.5,
        content: blog.content,
        likes: '0',
        likesCount: 0,
      }));

      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...newArticles]);
        initializeInteractionStates(newArticles);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          console.log('Intersection observed, loading more articles...');
          loadMoreArticles();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      console.log('Observing loadingRef:', currentLoadingRef);
      observer.observe(currentLoadingRef);
    }

    return () => {
      if (currentLoadingRef) {
        console.log('Unobserving loadingRef:', currentLoadingRef);
        observer.unobserve(currentLoadingRef);
      }
    };
  }, [loadMoreArticles, loading, hasMore]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setPage(0);
    setHasMore(true);
    setArticles([]);
  };

  const toggleLike = (articleId) => {
    const willLike = !userLikes[articleId];
    const url = `${BASEURL}/reactions`;

    if (willLike) {
      axios
        .post(
          url,
          { blogId: articleId, type: 'LIKE' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        )
        .then((res) => {
          if (res?.status === 200) {
            setArticles((prev) =>
              prev.map((article) => {
                if (article.id === articleId) {
                  const currentLikes = parseInt(article.likesCount || 0);
                  const newLikesCount = willLike ? currentLikes + 1 : currentLikes - 1;
                  const displayLikes =
                    newLikesCount >= 1000
                      ? `${(newLikesCount / 1000).toFixed(1)}K`
                      : newLikesCount.toString();

                  return {
                    ...article,
                    likes: displayLikes,
                    likesCount: newLikesCount,
                  };
                }
                return article;
              })
            );

            setUserLikes((prev) => ({ ...prev, [articleId]: willLike }));
          }
        })
        .catch((err) => console.error('Error liking article:', err));
    } else {
      axios
        .delete(`${url}?blogId=${articleId}&type=LIKE`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((res) => {
          if (res?.status === 200) {
            setArticles((prev) =>
              prev.map((article) => {
                if (article.id === articleId) {
                  const currentLikes = parseInt(article.likesCount || 0);
                  const newLikesCount = willLike ? currentLikes + 1 : currentLikes - 1;
                  const displayLikes =
                    newLikesCount >= 1000
                      ? `${(newLikesCount / 1000).toFixed(1)}K`
                      : newLikesCount.toString();

                  return {
                    ...article,
                    likes: displayLikes,
                    likesCount: newLikesCount,
                  };
                }
                return article;
              })
            );

            setUserLikes((prev) => ({ ...prev, [articleId]: willLike }));
          }
        })
        .catch((err) => console.error('Error unliking article:', err));
    }
  };

  const toggleBookmark = async (articleId) => {
    try {
      const userId = localStorage.getItem('userId');
      const url = `${BASEURL}/users/${userId}/saved-blogs`;
      const res = await axios.post(
        url,
        { blogId: articleId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-Auth-User-Id': userId,
          },
        }
      );

      if (res?.status === 200) {
        setUserBookmarks((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
      }
    } catch (err) {
      console.error('Error bookmarking article:', err);
    }
  };

  const toggleCommentSection = async (articleId) => {
    const article = articles.find((article) => article.id === articleId);
    if (article?.comments > 0) {
      setShowCommentSections((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
      return;
    }

    const userId = localStorage.getItem('userId');
    const url = `${BASEURL}/comments/blog/${articleId}?page=0&size=5`;

    try {
      const res = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Auth-User-Id': userId,
        },
      });

      const comments = res.data.content || [];
      const newComments = comments.map((comment) => ({
        id: comment.id || Date.now(),
        author: comment.username || 'Anonymous',
        text: comment.content,
        date: new Date(comment.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      }));

      setArticles((prev) =>
        prev.map((article) => {
          if (article.id === articleId) {
            const updatedCommentsList = [...article.commentsList, ...newComments];
            return {
              ...article,
              commentsList: updatedCommentsList,
              comments: updatedCommentsList.length,
            };
          }
          return article;
        })
      );

      setShowCommentSections((prev) => ({ ...prev, [articleId]: !prev[articleId] }));
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleCommentInputChange = (articleId, value) => {
    setCommentInputs((prev) => ({ ...prev, [articleId]: value }));
  };

  const submitComment = async (articleId) => {
    if (!commentInputs[articleId]?.trim()) return;

    const url = `${BASEURL}/comments`;
    try {
      const res = await axios.post(
        url,
        {
          blogId: articleId,
          content: commentInputs[articleId],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res?.status === 200) {
        const newComment = {
          id: Date.now(),
          author: currentUser.name,
          text: commentInputs[articleId],
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        setArticles((prev) =>
          prev.map((article) => {
            if (article.id === articleId) {
              const updatedCommentsList = [...article.commentsList, newComment];
              return {
                ...article,
                commentsList: updatedCommentsList,
                comments: updatedCommentsList.length,
              };
            }
            return article;
          })
        );

        setCommentInputs((prev) => ({ ...prev, [articleId]: '' }));
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="blog-feed-container">
      <div className="main-content">
        <nav className="feed-navigation">
          {/* <button className="add-content-button">+</button> */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'for-you' ? 'active' : ''}`}
              onClick={() => handleTabClick('for-you')}
            >
              For you
            </button>
            <button
              className={`tab ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => handleTabClick('following')}
            >
              Following
            </button>
            <button
              className={`tab ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => handleTabClick('featured')}
            >
              Featured <span className="new-badge">New</span>
            </button>
            <button
              className={`tab ${activeTab === 'entrepreneurship' ? 'active' : ''}`}
              onClick={() => handleTabClick('entrepreneurship')}
            >
              Entrepreneurship
            </button>
            <button
              className={`tab ${activeTab === 'react' ? 'active' : ''}`}
              onClick={() => handleTabClick('react')}
            >
              React
            </button>
            <button
              className={`tab ${activeTab === 'software-engineering' ? 'active' : ''}`}
              onClick={() => handleTabClick('software-engineering')}
            >
              Software Engineering
            </button>
          </div>
        </nav>

        <div className="articles-container">
          {articles.map((article) => (
            <article className="article-card" key={article.id}>
              <div className="article-content" onClick={() => handleArticleClick(article.id)}>
                <div className="article-author">
                  <div className="author-image-container">
                    <div className="author-avatar"></div>
                  </div>
                  <div className="author-info">
                    <span>
                      In {article.publication} by {article.author}
                    </span>
                    {article.verified && <span className="verified-badge">✓</span>}
                  </div>
                </div>

                <div className="article-main">
                  <div className="article-text">
                    <h2 className="article-title">{article.title}</h2>
                    <p className="article-subtitle">{article.subtitle}</p>

                    <div className="article-meta">
                      <span className="article-date">{article.date}</span>
                      <span className="article-reading-time">{article.readingTime}</span>
                      <span className="article-likes">{article.likes}</span>
                      <span >{article.comments}</span>
                    </div>
                  </div>

                  <div className="article-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                </div>

                <div className="article-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className={`action-button ${userLikes[article.id] ? 'active' : ''}`}
                    onClick={() => toggleLike(article.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill={userLikes[article.id] ? '#FF4500' : 'none'}
                        stroke={userLikes[article.id] ? '#FF4500' : 'currentColor'}
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button
                    className={`action-button ${showCommentSections[article.id] ? 'active' : ''}`}
                    onClick={() => toggleCommentSection(article.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"
                        fill={showCommentSections[article.id] ? '#1a8917' : 'none'}
                        stroke={showCommentSections[article.id] ? '#1a8917' : 'currentColor'}
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button
                    className={`action-button ${userBookmarks[article.id] ? 'active' : ''}`}
                    onClick={() => toggleBookmark(article.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
                        fill={userBookmarks[article.id] ? '#0066FF' : 'none'}
                        stroke={userBookmarks[article.id] ? '#0066FF' : 'currentColor'}
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                  <button className="action-button more-button">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                {showCommentSections[article.id] && (
                  <div
                    className="article-comments-section"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h4>Comments ({article.comments})</h4>

                    <div className="comments-list">
                      {article.commentsList &&
                        article.commentsList.map((comment) => (
                          <div className="comment-item" key={comment.id}>
                            <div className="comment-author">{comment.author}</div>
                            <div className="comment-text">{comment.text}</div>
                            <div className="comment-date">{comment.date}</div>
                          </div>
                        ))}
                    </div>

                    <div className="add-comment">
                      <div className="current-user-avatar"></div>
                      <div className="comment-input-container">
                        <input
                          type="text"
                          className="comment-input"
                          placeholder="Write a comment..."
                          value={commentInputs[article.id] || ''}
                          onChange={(e) => handleCommentInputChange(article.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitComment(article.id)}
                        />
                        <button
                          className="post-comment-button"
                          onClick={() => submitComment(article.id)}
                          disabled={!commentInputs[article.id]?.trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}

          {/* Loading indicator */}
          {hasMore && (
            <div className="loading-container" ref={loadingRef}>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading more articles...</p>
                </div>
              ) : (
                <div className="loading-trigger" style={{ height: '20px' }}></div>
              )}
            </div>
          )}

          {!hasMore && articles.length > 0 && (
            <div className="end-of-feed">
              <p>You've reached the end of your feed</p>
              <button
                className="refresh-feed-button"
                onClick={() => {
                  setPage(0);
                  setArticles([]);
                  setHasMore(true);
                }}
              >
                Refresh Feed
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogFeed;
// ArticleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './ArticleDetail.css';
import { BASEURL } from '../../constants';
import axios from 'axios';
import avatar from './avatar.jpg'
import techImg from './tech.jpg';

const ArticleDetail = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLike, setUserLike] = useState(false);
  const [userBookmark, setUserBookmark] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [currentUser] = useState({
    name: localStorage.getItem('userName') || 'Anonymous',
    avatar: avatar,
  });

  // const computeReadTime = (content) => {
  //   const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  //   const words = text.split(' ').filter((word) => word.length > 0);
  //   const count = words.length;
  //   const minutes = Math.ceil(count / 200);
  //   return `${minutes} min read`;
  // };

  useEffect(() => {
    const fetchArticle = async () => {
      setIsLoading(true);
      try {
        const passedArticle = location.state?.article;
        if (passedArticle) {
          setArticle(passedArticle);
          setUserLike(false);
          setUserBookmark(false);
        }

        const commentsResponse = await axios.get(
          `${BASEURL}/comments/blog/${articleId}?page=0&size=5`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'X-Auth-User-Id': localStorage.getItem('userId'),
            },
          }
        );

        const comments = commentsResponse.data.content || [];
        const mappedComments = comments.map((comment) => ({
          id: comment.id || Date.now(),
          author: comment.username || 'Anonymous',
          text: comment.content,
          date: new Date(comment.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
        }));

        setArticle({
          ...passedArticle,
          commentsList: mappedComments,
          comments: mappedComments.length,
        });
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (isLoading) {
    return (
      <div className="article-detail-loading">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-not-found">
        <h2>Article not found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <button className="back-button" onClick={() => navigate('/feed')}>
          Back to Feed
        </button>
      </div>
    );
  }

  const handleLike = async () => {
    const willLike = !userLike;
    const url = `${BASEURL}/reactions`;

    try {
      if (willLike) {
        const res = await axios.post(
          url,
          { blogId: articleId, type: 'LIKE' },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (res?.status === 200) {
          setArticle((prev) => {
            const currentLikes = parseInt(prev.likesCount || 0);
            const newLikesCount = willLike ? currentLikes + 1 : currentLikes - 1;
            const displayLikes =
              newLikesCount >= 1000
                ? `${(newLikesCount / 1000).toFixed(1)}K`
                : newLikesCount.toString();

            return {
              ...prev,
              likes: displayLikes,
              likesCount: newLikesCount,
            };
          });
          setUserLike(willLike);
        }
      } else {
        const res = await axios.delete(`${url}?blogId=${articleId}&type=LIKE`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (res?.status === 200) {
          setArticle((prev) => {
            const currentLikes = parseInt(prev.likesCount || 0);
            const newLikesCount = willLike ? currentLikes + 1 : currentLikes - 1;
            const displayLikes =
              newLikesCount >= 1000
                ? `${(newLikesCount / 1000).toFixed(1)}K`
                : newLikesCount.toString();

            return {
              ...prev,
              likes: displayLikes,
              likesCount: newLikesCount,
            };
          });
          setUserLike(willLike);
        }
      }
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };

  const handleBookmark = async () => {
    const userId = localStorage.getItem('userId');
    const url = `${BASEURL}/users/${userId}/saved-blogs`;

    try {
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
        setUserBookmark((prev) => !prev);
      }
    } catch (err) {
      console.error('Error updating bookmark:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const url = `${BASEURL}/comments`;
    try {
      const res = await axios.post(
        url,
        {
          blogId: articleId,
          content: commentInput,
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
          text: commentInput,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        setArticle((prev) => ({
          ...prev,
          commentsList: [...prev.commentsList, newComment],
          comments: prev.commentsList.length + 1,
        }));
        setCommentInput('');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <button className="back-button" onClick={() => navigate('/feed')}>
          ← Back to Feed
        </button>

        <div className="article-detail-meta">
          <div className="author-info">
            <div className="author-avatar">
            <img src={avatar} alt="Author Avatar" />
            </div>
            <div>
              <p className="author-name">{article.author}</p>
              <p className="article-publication">
                Published in {article.publication} · {article.date} · {article.readingTime}
                {article.verified && <span className="verified-badge">✓</span>}
              </p>
            </div>
          </div>

          <div className="article-detail-actions">
            <button
              className={`action-button ${userLike ? 'active' : ''}`}
              onClick={handleLike}
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
                  fill={userLike ? '#FF4500' : 'none'}
                  stroke={userLike ? '#FF4500' : 'currentColor'}
                  strokeWidth="2"
                />
              </svg>
              <span>{article.likes}</span>
            </button>

            <button
              className={`action-button ${userBookmark ? 'active' : ''}`}
              onClick={handleBookmark}
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
                  fill={userBookmark ? '#0066FF' : 'none'}
                  stroke={userBookmark ? '#0066FF' : 'currentColor'}
                  strokeWidth="2"
                />
              </svg>
              <span>Save</span>
            </button>

            <button className="action-button share-button">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                  fill="currentColor"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="article-detail-content">
        <h1 className="article-detail-title">{article.title}</h1>
        <h2 className="article-detail-subtitle">{article.subtitle}</h2>

        <div className="article-featured-image">
          <img src={article.image || techImg} alt={article.title} />
        </div>

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>

      <div className="article-comments">
        <h3>Comments ({article.comments})</h3>

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

        <form className="add-comment" onSubmit={handleCommentSubmit}>
          <div className="current-user-avatar"></div>
          <div className="comment-input-container">
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button
              type="submit"
              className="post-comment-button"
              disabled={!commentInput.trim()}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleDetail;
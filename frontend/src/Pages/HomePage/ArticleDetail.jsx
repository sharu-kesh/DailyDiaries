import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ArticleDetail.css';

const ArticleDetail = ({ articles }) => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userLike, setUserLike] = useState(false);
  const [userBookmark, setUserBookmark] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [currentUser] = useState({
    name: "Current User",
    avatar: "https://placeholder.com/40x40"
  });

  useEffect(() => {
    // In a real app, you'd fetch the article data from an API
    // For this example, we're using the passed articles prop
    if (articles) {
      const foundArticle = articles.find(a => a.id === parseInt(articleId));
      
      if (foundArticle) {
        setArticle(foundArticle);
        setUserLike(false); // Reset like state for this article
        setUserBookmark(false); // Reset bookmark state for this article
      }
    }
    
    setIsLoading(false);
  }, [articleId, articles]);

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
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Feed
        </button>
      </div>
    );
  }

  const handleLike = () => {
    setUserLike(prev => !prev);
    // In a real app, you'd send an API request to update likes
  };

  const handleBookmark = () => {
    setUserBookmark(prev => !prev);
    // In a real app, you'd send an API request to update bookmarks
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    
    // In a real app, you'd send this to an API
    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      text: commentInput,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    // Update local state (in a real app, this would come from the API response)
    setArticle(prev => ({
      ...prev,
      commentsList: [...prev.commentsList, newComment],
      comments: prev.commentsList.length + 1
    }));
    
    setCommentInput('');
  };

  return (
    <div className="article-detail-container">
      <div className="article-detail-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Feed
        </button>
        
        <div className="article-detail-meta">
          <div className="author-info">
            <div className="author-avatar"></div>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                  fill={userLike ? "#FF4500" : "none"} 
                  stroke={userLike ? "#FF4500" : "currentColor"} 
                  strokeWidth="2"/>
              </svg>
              <span>{article.likes}</span>
            </button>
            
            <button 
              className={`action-button ${userBookmark ? 'active' : ''}`}
              onClick={handleBookmark}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" 
                  fill={userBookmark ? "#0066FF" : "none"} 
                  stroke={userBookmark ? "#0066FF" : "currentColor"} 
                  strokeWidth="2"/>
              </svg>
              <span>Save</span>
            </button>
            
            <button className="action-button share-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" 
                  fill="currentColor" />
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
          <img src={article.image} alt={article.title} />
        </div>
        
        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }}></div>
      </div>
      
      <div className="article-comments">
        <h3>Comments ({article.comments})</h3>
        
        <div className="comments-list">
          {article.commentsList && article.commentsList.map(comment => (
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
import React, { useState, useEffect } from 'react';
import './HomePage.css';

// Mock data for demonstration
const mockArticles = [
  {
    id: 1,
    title: "How I'd learn ML in 2025 (if I could start over)",
    subtitle: "All you need to learn ML in 2025 is a laptop and a list of the steps you must take.",
    author: "Boris Meinardus",
    publication: "Towards AI",
    date: "Jan 2",
    readingTime: "5 min read",
    likes: "1.7K",
    likesCount: 1700,
    comments: 47,
    commentsList: [
      { id: 1, author: "Sarah Chen", text: "This is exactly what I needed! Just starting my ML journey.", date: "Jan 3" },
      { id: 2, author: "Mike Johnson", text: "Great breakdown of the learning path. I'd add that practicing with real datasets is crucial.", date: "Jan 4" }
    ],
    image: "https://placeholder.com/300x200",
    verified: false
  },
  {
    id: 2,
    title: "Agentic AI: Building Autonomous Systems from Scratch",
    subtitle: "A Step-by-Step Guide to Creating Multi-Agent Frameworks in the Age of Generative AI",
    author: "Luis Roque",
    publication: "TDS Archive",
    date: "Dec 13, 2024",
    readingTime: "8 min read",
    likes: "900",
    likesCount: 900,
    comments: 21,
    commentsList: [
      { id: 1, author: "Alex Rivera", text: "The multi-agent approach is fascinating. Have you tested this with complex systems?", date: "Dec 14" }
    ],
    image: "https://placeholder.com/300x200",
    verified: true
  },
  {
    id: 3,
    title: "Yes, You Can Still Land a Junior Developer Role",
    subtitle: "5 proven strategies that worked for my bootcamp students",
    author: "Kate Angelopoulos",
    publication: "Stackademic",
    date: "Dec 5, 2024",
    readingTime: "7 min read",
    likes: "1.2K",
    likesCount: 1200,
    comments: 35,
    commentsList: [
      { id: 1, author: "James Lee", text: "Your advice on building a portfolio really helped me land my first dev job!", date: "Dec 7" },
      { id: 2, author: "Priya Patel", text: "I'm struggling with technical interviews. Any specific advice?", date: "Dec 8" }
    ],
    image: "https://placeholder.com/300x200",
    verified: false
  }
];

const staffPicks = [
  {
    id: 1,
    title: "The Tools Will Change. Your Craft Doesn't Have To.",
    author: "Agustin Sanchez",
    date: "Apr 14",
    image: "https://placeholder.com/40x40"
  },
  {
    id: 2,
    title: "Why Your Child Can't Stop Using That App (A Game Designer's Warning)",
    author: "Sam Liberty",
    publication: "Bootcamp",
    date: "Mar 31",
    image: "https://placeholder.com/40x40"
  },
  {
    id: 3,
    title: "Our Souls Need Proof of Work",
    author: "Julie Zhuo",
    date: "Mar 10",
    image: "https://placeholder.com/40x40"
  }
];

const recommendedTopics = ["Writing", "Cryptocurrency", "Politics", "Relationships", "Business", "Psychology", "Health"];

const BlogFeed = () => {
  const [activeTab, setActiveTab] = useState('for-you');
  const [articles, setArticles] = useState([]);
  const [userLikes, setUserLikes] = useState({});
  const [userBookmarks, setUserBookmarks] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showCommentSections, setShowCommentSections] = useState({});
  const [currentUser] = useState({
    name: "Current User",
    avatar: "https://placeholder.com/40x40"
  });

  useEffect(() => {
    // In a real app, you would fetch data from an API here
    setArticles(mockArticles);
    
    // Initialize states for user interactions
    const initialLikes = {};
    const initialBookmarks = {};
    const initialCommentInputs = {};
    const initialCommentSections = {};
    
    mockArticles.forEach(article => {
      initialLikes[article.id] = false;
      initialBookmarks[article.id] = false;
      initialCommentInputs[article.id] = '';
      initialCommentSections[article.id] = false;
    });
    
    setUserLikes(initialLikes);
    setUserBookmarks(initialBookmarks);
    setCommentInputs(initialCommentInputs);
    setShowCommentSections(initialCommentSections);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const toggleLike = (articleId) => {
    setUserLikes(prev => {
      const newLikes = { ...prev, [articleId]: !prev[articleId] };
      return newLikes;
    });
    
    setArticles(prev => {
      return prev.map(article => {
        if (article.id === articleId) {
          const currentLikes = parseInt(article.likesCount);
          const newLikesCount = userLikes[articleId] ? currentLikes - 1 : currentLikes + 1;
          const displayLikes = newLikesCount >= 1000 ? `${(newLikesCount / 1000).toFixed(1)}K` : newLikesCount.toString();
          
          return {
            ...article,
            likes: displayLikes,
            likesCount: newLikesCount
          };
        }
        return article;
      });
    });
  };

  const toggleBookmark = (articleId) => {
    setUserBookmarks(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const toggleCommentSection = (articleId) => {
    setShowCommentSections(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const handleCommentInputChange = (articleId, value) => {
    setCommentInputs(prev => ({ ...prev, [articleId]: value }));
  };

  const submitComment = (articleId) => {
    if (!commentInputs[articleId].trim()) return;
    
    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      text: commentInputs[articleId],
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    setArticles(prev => {
      return prev.map(article => {
        if (article.id === articleId) {
          const updatedCommentsList = [...article.commentsList, newComment];
          return {
            ...article,
            commentsList: updatedCommentsList,
            comments: updatedCommentsList.length
          };
        }
        return article;
      });
    });
    
    setCommentInputs(prev => ({ ...prev, [articleId]: '' }));
  };

  return (
    <div className="blog-feed-container">
      <div className="main-content">
        <nav className="feed-navigation">
          <button className="add-content-button">+</button>
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
          {articles.map(article => (
            <article className="article-card" key={article.id}>
              <div className="article-content">
                <div className="article-author">
                  <div className="author-image-container">
                    <div className="author-avatar"></div>
                  </div>
                  <div className="author-info">
                    <span>In {article.publication} by {article.author}</span>
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
                      <span className="article-comments">{article.comments}</span>
                    </div>
                  </div>
                  
                  <div className="article-image">
                    <img src={article.image} alt={article.title} />
                  </div>
                </div>
                
                <div className="article-actions">
                  <button 
                    className={`action-button ${userLikes[article.id] ? 'active' : ''}`}
                    onClick={() => toggleLike(article.id)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                        fill={userLikes[article.id] ? "#FF4500" : "none"} 
                        stroke={userLikes[article.id] ? "#FF4500" : "currentColor"} 
                        strokeWidth="2"/>
                    </svg>
                  </button>
                  <button 
                    className={`action-button ${showCommentSections[article.id] ? 'active' : ''}`}
                    onClick={() => toggleCommentSection(article.id)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" 
                        fill={showCommentSections[article.id] ? "#1a8917" : "none"} 
                        stroke={showCommentSections[article.id] ? "#1a8917" : "currentColor"} 
                        strokeWidth="2"/>
                    </svg>
                  </button>
                  <button 
                    className={`action-button ${userBookmarks[article.id] ? 'active' : ''}`}
                    onClick={() => toggleBookmark(article.id)}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" 
                        fill={userBookmarks[article.id] ? "#0066FF" : "none"} 
                        stroke={userBookmarks[article.id] ? "#0066FF" : "currentColor"} 
                        strokeWidth="2"/>
                    </svg>
                  </button>
                  <button className="action-button more-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
                    </svg>
                  </button>
                </div>
                
                {showCommentSections[article.id] && (
                  <div className="article-comments-section">
                    <h4>Comments ({article.comments})</h4>
                    
                    <div className="comments-list">
                      {article.commentsList && article.commentsList.map(comment => (
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
                          value={commentInputs[article.id]}
                          onChange={(e) => handleCommentInputChange(article.id, e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitComment(article.id)}
                        />
                        <button 
                          className="post-comment-button"
                          onClick={() => submitComment(article.id)}
                          disabled={!commentInputs[article.id].trim()}
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
        </div>
      </div>

      <aside className="sidebar">
        <section className="staff-picks">
          <h3>Staff Picks</h3>
          <ul className="staff-picks-list">
            {staffPicks.map(pick => (
              <li key={pick.id} className="staff-pick-item">
                <div className="pick-author-image">
                  <img src={pick.image} alt={pick.author} />
                </div>
                <div className="pick-content">
                  <div className="pick-author-name">{pick.author}</div>
                  <h4 className="pick-title">{pick.title}</h4>
                  <div className="pick-date">{pick.date}</div>
                </div>
              </li>
            ))}
          </ul>
          <a href="#" className="see-all-link">See the full list</a>
        </section>

        <section className="recommended-topics">
          <h3>Recommended topics</h3>
          <div className="topic-tags">
            {recommendedTopics.map((topic, index) => (
              <span key={index} className="topic-tag">{topic}</span>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
};

export default BlogFeed;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../Pages/HomePage/ArticleDetail.css';
import tech from './tech.jpg';
import blog from './blog.jpg';
import travel from './travel.jpeg';
import avatar from './avatar.jpg';

const LandingPage = () => {
  const [userLike, setUserLike] = useState(false);
  const [userBookmark, setUserBookmark] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [commentsList, setCommentsList] = useState([
    {
      id: 1,
      author: 'Jane Smith',
      text: 'Great article! Really enjoyed the insights.',
      date: 'Apr 20, 2025',
    },
    {
      id: 2,
      author: 'Alex Brown',
      text: 'Thanks for sharing this perspective!',
      date: 'Apr 21, 2025',
    },
  ]);
  const [likesCount, setLikesCount] = useState(42);
  const [currentUser] = useState({
    name: isAuthenticated ? 'LoggedIn User' : 'Anonymous',
    avatar: avatar,
  });

  // Static article data
  const article = {
    title: 'The Future of Technology',
    subtitle: 'Exploring the latest trends in AI and machine learning',
    content: `
      <p>The future of technology is unfolding at an unprecedented pace, reshaping how we live, work, and interact with the world. Innovations like quantum computing, 6G networks, and advanced robotics are no longer distant dreams but tangible realities on the horizon. These breakthroughs promise to solve complex problems, from climate change to global healthcare, by harnessing the power of data, connectivity, and automation in ways we’ve never seen before.</p>
      <p>At the heart of this transformation is the convergence of multiple technologies. For instance, the Internet of Things (IoT) is connecting billions of devices, creating smart ecosystems in cities, homes, and industries. Meanwhile, advancements in biotechnology are revolutionizing medicine, with gene-editing tools like CRISPR offering the potential to cure genetic diseases. As these technologies evolve, they’re not just improving efficiency—they’re redefining what’s possible for humanity.</p>
      <h2>Why AI Matters</h2>
      <p>Artificial intelligence is transforming industries by enabling smarter decision-making and automation. From healthcare to finance, AI is paving the way for a more efficient future. In hospitals, AI-powered diagnostics can detect diseases like cancer with greater accuracy than human doctors, while in finance, algorithms are predicting market trends and detecting fraud in real-time. As AI continues to advance, its ability to learn, adapt, and interact with humans will unlock new opportunities, making it a cornerstone of technological progress in the years to come.</p>
    `,
    image: tech,
    author: 'John Doe',
    authorAvatar: avatar, // Added avatar for John Doe
    publication: 'Tech Insights',
    date: 'Apr 20, 2025',
    readingTime: '5 min read',
    verified: true,
    likes: likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount,
    comments: commentsList.length,
  };

  // Sample blog data for other posts
  const blogs = [
    {
      id: 1,
      title: 'Why Blogging Matters',
      excerpt: 'How blogging can shape your personal brand.',
      author: 'Jane Smith',
      date: 'Apr 18, 2025',
      image: blog,
    },
    {
      id: 2,
      title: 'Travel Diaries',
      excerpt: 'A journey through the mountains of Himalayas.',
      author: 'Alex Brown',
      date: 'Apr 15, 2025',
      image: travel,
    },
  ];

  const handleLike = () => {
    setUserLike((prev) => !prev);
    setLikesCount((prev) => (userLike ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setUserBookmark((prev) => !prev);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (!commentInput.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      text: commentInput,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    setCommentsList((prev) => [...prev, newComment]);
    setCommentInput('');
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="home-header">
        <nav className="home-nav">
          <Link to="/" className="home-logo">
            DailyDiaries
          </Link>
          <div className="home-auth-links">
            <Link to="/login" className="home-auth-link">
              Login
            </Link>
            <Link to="/signup" className="home-auth-button">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero-content">
            <h1 className="home-hero-title">Welcome to DailyDiaries</h1>
            <p className="home-hero-subtitle">
              Discover stories, insights, and ideas from passionate writers.
            </p>
          </div>
        </section>

        {/* Featured Article Section */}
        <section id="article" className="article-detail-container">
          <h2 className="home-section-title">Featured Article</h2>
          <div className="article-detail-header">
            <div className="article-detail-meta">
              <div className="author-info">
                <img
                  src={article.authorAvatar}
                  alt={article.author}
                  className="author-avatar"
                />
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
                <button className="action-button">
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
              <img src={article.image} alt={article.title} />
            </div>
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
          <div className="article-comments">
            <h3>Comments ({article.comments})</h3>
            <div className="comments-list">
              {commentsList.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-text">{comment.text}</div>
                  <div className="comment-date">{comment.date}</div>
                </div>
              ))}
            </div>
            {isAuthenticated ? (
              <form className="add-comment" onSubmit={handleCommentSubmit}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="current-user-avatar"
                />
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
            ) : (
              <div className="comment-login-prompt">
                <p>
                  Please{' '}
                  <Link to="/login" className="comment-login-link">
                    log in
                  </Link>{' '}
                  or{' '}
                  <Link to="/signup" className="comment-login-link">
                    sign up
                  </Link>{' '}
                  to post a comment.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Other Blogs Section */}
        <section className="home-blogs">
          <h2 className="home-section-title">More Blogs</h2>
          <div className="home-blogs-grid">
            {blogs.map((blog) => (
              <div key={blog.id} className="home-blog-card">
                <img src={blog.image} alt={blog.title} className="home-blog-image" />
                <div className="home-blog-content">
                  <h3 className="home-blog-title">{blog.title}</h3>
                  <p className="home-blog-excerpt">{blog.excerpt}</p>
                  <div className="home-blog-meta">
                    <span>{blog.author}</span>
                    <span>{blog.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 DailyDiaries. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ThumbsUp, Bookmark, MoreHorizontal } from 'lucide-react';
import { AiOutlineTable, AiOutlineUser } from 'react-icons/ai';
import { BiBookmark } from 'react-icons/bi';
import axios from 'axios';
import { BASEURL } from '../../constants';

// Article Preview Component
const ArticlePreview = () => {
  const navigate = useNavigate();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [myBlogs, setMyBlogs] = useState([]);
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [isMyBlogsLoading, setIsMyBlogsLoading] = useState(false);
  const [isSavedBlogsLoading, setIsSavedBlogsLoading] = useState(false);
  const [myBlogsError, setMyBlogsError] = useState(null);
  const [savedBlogsError, setSavedBlogsError] = useState(null);
  const [myBlogsPage, setMyBlogsPage] = useState(0);
  const [savedBlogsPage, setSavedBlogsPage] = useState(0);
  const [hasMoreMyBlogs, setHasMoreMyBlogs] = useState(true);
  const [hasMoreSavedBlogs, setHasMoreSavedBlogs] = useState(true);
  const loadingRef = useRef(null);

  // Initial fetch for both My Blogs and Saved Blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setMyBlogsError('User ID not found in localStorage');
        setSavedBlogsError('User ID not found in localStorage');
        return;
      }

      try {
        setIsMyBlogsLoading(true);
        setIsSavedBlogsLoading(true);

        const [myBlogsResponse, savedBlogsResponse] = await Promise.all([
          axios.get(`${BASEURL}/blogs?userIds=${userId}&page=0&size=10`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'X-Auth-User-Id': userId,
            },
          }),
          axios.get(`${BASEURL}/users/${userId}/saved-blogs?page=0&size=10`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'X-Auth-User-Id': userId,
            },
          }),
        ]);

        // Handle My Blogs response
        if (myBlogsResponse?.status !== 200) {
          throw new Error('Failed to fetch My Blogs');
        }
        const myBlogsData = myBlogsResponse.data.content || myBlogsResponse.data || [];
        const mappedMyBlogs = myBlogsData.map((blog) => ({
          id: blog.id,
          title: blog.title,
          subtitle: blog.subtitle,
          image: blog.titleImage || blog.image || 'https://via.placeholder.com/150',
          publication: 'MyBlogPlatform',
          author: blog.username || blog.author || 'Unknown',
          verified: blog.verified || false,
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          views: blog.views || 0,
          comments: blog.commentCount || blog.comments || 0,
        }));
        setMyBlogs(mappedMyBlogs);
        setMyBlogsPage(1); // Next page to fetch

        // Handle Saved Blogs response
        if (savedBlogsResponse?.status !== 200) {
          throw new Error('Failed to fetch Saved Blogs');
        }
        const savedBlogsData = savedBlogsResponse.data.content || savedBlogsResponse.data || [];
        const mappedSavedBlogs = savedBlogsData.map((blog) => ({
          id: blog.id,
          title: blog.title,
          subtitle: blog.subtitle,
          image: blog.titleImage || blog.image || 'https://via.placeholder.com/150',
          publication: 'MyBlogPlatform',
          author: blog.username || blog.author || 'Unknown',
          verified: blog.verified || false,
          date: new Date(blog.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          views: blog.views || 0,
          comments: blog.commentCount || blog.comments || 0,
        }));
        setSavedBlogs(mappedSavedBlogs);
        setSavedBlogsPage(1); // Next page to fetch
      } catch (err) {
        console.error('Error fetching blogs:', err.message);
        setMyBlogsError(err.message);
        setSavedBlogsError(err.message);
      } finally {
        setIsMyBlogsLoading(false);
        setIsSavedBlogsLoading(false);
      }
    };

    fetchBlogs();
  }, []); // Empty dependency array to fetch once on mount

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isMyBlogsLoading &&
          !isSavedBlogsLoading &&
          (activeTabIndex === 0 ? hasMoreMyBlogs : hasMoreSavedBlogs)
        ) {
          console.log('Intersection observed, fetching more blogs...');
          fetchMoreBlogs();
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
  }, [isMyBlogsLoading, isSavedBlogsLoading, hasMoreMyBlogs, hasMoreSavedBlogs, activeTabIndex]);

  // Fetch more blogs for the active tab
  const fetchMoreBlogs = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      if (activeTabIndex === 0) setMyBlogsError('User ID not found in localStorage');
      else setSavedBlogsError('User ID not found in localStorage');
      return;
    }

    try {
      if (activeTabIndex === 0) {
        setIsMyBlogsLoading(true);
      } else {
        setIsSavedBlogsLoading(true);
      }

      const url =
        activeTabIndex === 0
          ? `${BASEURL}/blogs?userIds=${userId}&page=${myBlogsPage}&size=10`
          : `${BASEURL}/users/${userId}/saved-blogs?page=${savedBlogsPage}&size=10`;

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Auth-User-Id': userId,
        },
      });

      console.log('Fetch more blogs response:', response);

      if (response?.status !== 200) {
        throw new Error(`Failed to fetch ${activeTabIndex === 0 ? 'My Blogs' : 'Saved Blogs'}`);
      }

      const blogs = response.data.content || response.data || [];
      const mappedBlogs = blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        subtitle: blog.subtitle,
        image: blog.titleImage || blog.image || 'https://via.placeholder.com/150',
        publication: 'MyBlogPlatform',
        author: blog.username || blog.author || 'Unknown',
        verified: blog.verified || false,
        date: new Date(blog.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        views: blog.views || 0,
        comments: blog.commentCount || blog.comments || 0,
      }));

      if (activeTabIndex === 0) {
        setMyBlogs((prev) => [...prev, ...mappedBlogs]);
        setMyBlogsPage((prev) => prev + 1);
        setHasMoreMyBlogs(blogs.length > 0);
      } else {
        setSavedBlogs((prev) => [...prev, ...mappedBlogs]);
        setSavedBlogsPage((prev) => prev + 1);
        setHasMoreSavedBlogs(blogs.length > 0);
      }
    } catch (err) {
      console.error('Error fetching more blogs:', err.message);
      if (activeTabIndex === 0) setMyBlogsError(err.message);
      else setSavedBlogsError(err.message);
    } finally {
      if (activeTabIndex === 0) setIsMyBlogsLoading(false);
      else setIsSavedBlogsLoading(false);
    }
  };

  const handleArticleClick = (articleId) => {
    const articles = activeTabIndex === 0 ? myBlogs : savedBlogs;
    const selectedArticle = articles.find((article) => article.id === parseInt(articleId));
    navigate(`/article/${articleId}`, { state: { article: selectedArticle } });
  };

  // Inline styles
  const styles = {
    DividerContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '600px',
      borderTop: '1px solid #dbdbdb',
      position: 'relative',
      marginBottom: '1rem',
      marginLeft: '30%',
    },
    articleContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      width: '100%',
      maxWidth: '700px',
      backgroundColor: 'white',
      padding: '24px',
      marginLeft: '30%',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    outerbox: {
      display: 'flex',
      flexDirection: 'column',
    },
    articlePreview: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      cursor: 'pointer',
    },
    publicationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    publicationIcon: {
      width: '24px',
      height: '24px',
      backgroundColor: '#e2e2e2',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 'bold',
    },
    authorText: {
      fontSize: '14px',
      color: '#555',
    },
    publicationName: {
      fontWeight: '500',
    },
    verifiedBadge: {
      display: 'inline-flex',
      marginLeft: '4px',
    },
    checkmark: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '16px',
      backgroundColor: '#3897f0',
      borderRadius: '50%',
      color: 'white',
      fontSize: '10px',
    },
    articleContent: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px',
    },
    articleText: {
      flex: '1',
    },
    articleTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
      lineHeight: '1.3',
      color: '#222',
    },
    articleSubtitle: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.4',
    },
    articleImage: {
      width: '128px',
      height: '96px',
      flexShrink: '0',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '6px',
    },
    articleMetrics: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '8px',
    },
    metricsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    metric: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    starIcon: {
      width: '16px',
      height: '16px',
      color: '#ffc107',
    },
    metricIcon: {
      width: '16px',
      height: '16px',
      color: '#aaa',
    },
    metricText: {
      fontSize: '14px',
      color: '#777',
    },
    metricsRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      padding: '4px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #eaeaea',
      margin: '8px 0',
    },
    loading: {
      textAlign: 'center',
      padding: '24px',
      color: '#555',
    },
    error: {
      textAlign: 'center',
      padding: '24px',
      color: '#d32f2f',
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '24px',
      minHeight: '20px',
    },
    endOfFeed: {
      textAlign: 'center',
      padding: '24px',
      color: '#777',
    },
  };

  const tabs = [
    {
      tab: 'My Blogs',
      icon: <AiOutlineTable />,
      activeTab: false,
    },
    {
      tab: 'Saved Blogs',
      icon: <BiBookmark />,
      activeTab: false,
    },
  ];

  // Select articles based on active tab
  const articles = activeTabIndex === 0 ? myBlogs : savedBlogs;
  const isLoading = activeTabIndex === 0 ? isMyBlogsLoading : isSavedBlogsLoading;
  const error = activeTabIndex === 0 ? myBlogsError : savedBlogsError;
  const hasMore = activeTabIndex === 0 ? hasMoreMyBlogs : hasMoreSavedBlogs;

  return (
    <div style={styles.outerbox}>
      <div style={styles.DividerContainer}>
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTabIndex(index)}
            className="ActiveTab"
            style={{
              fontWeight: index === activeTabIndex ? '600' : '400',
              marginRight: '35px',
              marginTop: '10px',
            }}
            onMouseOver={(e) => (e.target.style.color = '#00376b')}
            onMouseOut={(e) => (e.target.style.color = '#262626')}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.tab}</span>
            {index === activeTabIndex && <span className="ActiveTabIndicator" />}
          </div>
        ))}
      </div>
      <div style={styles.articleContainer}>
        {isLoading && articles.length === 0 && (
          <div style={styles.loading}>Loading blogs...</div>
        )}
        {error && <div style={styles.error}>Error: {error}</div>}
        {!isLoading && !error && articles.length === 0 && (
          <div style={styles.loading}>
            {activeTabIndex === 0 ? 'No blogs found.' : 'No saved blogs found.'}
          </div>
        )}
        {articles.map((article, index) => (
          <div
            key={article.id}
            style={styles.articlePreview}
            onClick={() => handleArticleClick(article.id)}
          >
            {/* Publication and Author */}
            <div style={styles.publicationInfo}>
              <div style={styles.publicationIcon}>{article.publication.charAt(0)}</div>
              <div style={styles.authorText}>
                In <span style={styles.publicationName}>{article.publication}</span> by{' '}
                {article.author}
                {article.verified && (
                  <span style={styles.verifiedBadge}>
                    <span style={styles.checkmark}>✓</span>
                  </span>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div style={styles.articleContent}>
              <div style={styles.articleText}>
                <h2 style={styles.articleTitle}>{article.title}</h2>
                <p style={styles.articleSubtitle}>{article.subtitle}</p>
              </div>
              <div style={styles.articleImage}>
                <img src={article.image} alt="Article thumbnail" style={styles.image} />
              </div>
            </div>

            {/* Metrics and Actions */}
            <div style={styles.articleMetrics} onClick={(e) => e.stopPropagation()}>
              <div style={styles.metricsLeft}>
                <div style={styles.metric}>
                  <Star style={{ ...styles.starIcon, fill: '#ffc107' }} />
                  <span style={styles.metricText}>{article.date}</span>
                </div>
                <div style={styles.metric}>
                  <MessageCircle style={styles.metricIcon} />
                  <span style={styles.metricText}>{article.views}</span>
                </div>
                <div style={styles.metric}>
                  <ThumbsUp style={styles.metricIcon} />
                  <span style={styles.metricText}>{article.comments}</span>
                </div>
              </div>
              <div style={styles.metricsRight}>
                <button style={styles.actionButton}>
                  <ThumbsUp style={styles.metricIcon} />
                </button>
                <button style={styles.actionButton}>
                  <Bookmark style={styles.metricIcon} />
                </button>
                <button style={styles.actionButton}>
                  <MoreHorizontal style={styles.metricIcon} />
                </button>
              </div>
            </div>

            {/* Divider */}
            {index !== articles.length - 1 && <hr style={styles.divider} />}
          </div>
        ))}
        {hasMore && (
          <div style={styles.loadingContainer} ref={loadingRef}>
            {isLoading && <div style={styles.loading}>Loading more blogs...</div>}
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <div style={styles.endOfFeed}>You've reached the end of your blogs</div>
        )}
      </div>
    </div>
  );
};

export default ArticlePreview;

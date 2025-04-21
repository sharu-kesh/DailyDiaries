import React from 'react';
import { useState } from 'react';
import { Star, MessageCircle, ThumbsUp, Bookmark, MoreHorizontal } from 'lucide-react';
import { AiOutlineTable, AiOutlineUser } from 'react-icons/ai';
import { BiBookmark } from 'react-icons/bi';
// Article Preview Component
const ArticlePreview = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0); 

  // Add inline styles
  const styles = {
    DividerContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '600px',
      borderTop: '1px solid #dbdbdb',
      position: 'relative',
      marginBottom: '1rem',
      marginLeft:'30%',
      
  },
    articleContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '32px',
      width: '100%',
      maxWidth: '700px',
      backgroundColor: 'white',
      padding: '24px',
      marginLeft:'30%',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
     
      
    },
    outerbox:{
      display:'flex',
      flexDirection:'column'
    },
    articlePreview: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    publicationInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
      fontWeight: 'bold'
    },
    authorText: {
      fontSize: '14px',
      color: '#555'
    },
    publicationName: {
      fontWeight: '500'
    },
    verifiedBadge: {
      display: 'inline-flex',
      marginLeft: '4px'
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
      fontSize: '10px'
    },
    articleContent: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '16px'
    },
    articleText: {
      flex: '1'
    },
    articleTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '8px',
      lineHeight: '1.3',
      color: '#222'
    },
    articleSubtitle: {
      fontSize: '16px',
      color: '#666',
      lineHeight: '1.4'
    },
    articleImage: {
      width: '128px',
      height: '96px',
      flexShrink: '0'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '6px'
    },
    articleMetrics: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '8px'
    },
    metricsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    metric: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    starIcon: {
      width: '16px',
      height: '16px',
      color: '#ffc107'
    },
    metricIcon: {
      width: '16px',
      height: '16px',
      color: '#aaa'
    },
    metricText: {
      fontSize: '14px',
      color: '#777'
    },
    metricsRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
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
      transition: 'background-color 0.2s'
    },
    divider: {
      border: 'none',
      borderTop: '1px solid #eaeaea',
      margin: '8px 0'
    }
  };

  const articles = [
    {
      id: 1,
      publication: "The Velvet Guillotine",
      author: "Roy Phang",
      title: "How 60 Minutes a Day Can Change Your Life",
      subtitle: "The simple commitment most people avoid that can dramatically transform you",
      date: "Dec 17, 2024",
      views: "16.1K",
      comments: "717",
      image: "/api/placeholder/200/150",
      verified: true
    },
    {
      id: 2,
      publication: "Level Up Coding",
      author: "Matt Bentley",
      title: "My Favourite Software Architecture Patterns",
      subtitle: "Exploring my most loved Software Architecture patterns and their practical applications.",
      date: "Nov 12, 2024",
      views: "5.3K",
      comments: "89",
      image: "/api/placeholder/200/150",
      verified: false
    }
  ];
  const tabs = [
    {
      tab: 'Post',
      icon: <AiOutlineTable />,
      activeTab: false,
    },
    {
      tab: 'Saved',
      icon: <BiBookmark />,
      activeTab: false,
    },
    {
      tab: 'Tagged',
      icon: <AiOutlineUser />,
      activeTab: false,
    },
  ];

  return (
    <div style={styles.outerbox}>
      <div style={styles.DividerContainer}>
        {tabs.map((item, index) => (
          <div
            key={index}
            onClick={() => setActiveTabIndex(index)}
            className="ActiveTab" style={{ fontWeight: index === activeTabIndex ? '600' : '400' , marginRight:'35px', marginTop:'10px' }}
            onMouseOver={(e) => (e.target.style.color = '#00376b')}
            onMouseOut={(e) => (e.target.style.color = '#262626')}
            
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.tab}</span>
            {index === activeTabIndex && (
              <span className="ActiveTabIndicator"/>
            )}
          </div>
        ))}
      </div>
    <div style={styles.articleContainer}>
       
      {articles.map((article, index) => (
        <div key={article.id} style={styles.articlePreview}>
          {/* Publication and Author */}
          <div style={styles.publicationInfo}>
            <div style={styles.publicationIcon}>
              {article.publication.charAt(0)}
            </div>
            <div style={styles.authorText}>
              In <span style={styles.publicationName}>{article.publication}</span> by {article.author} 
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
          <div style={styles.articleMetrics}>
            <div style={styles.metricsLeft}>
              <div style={styles.metric}>
                <Star style={{...styles.starIcon, fill: '#ffc107'}} />
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
    </div>
    </div>
  );
};

export default ArticlePreview;
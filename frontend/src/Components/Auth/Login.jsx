import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#FFFFFF',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    logo: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '48px',
      color: '#242424'
    },
    formContainer: {
      width: '100%',
      maxWidth: '416px'
    },
    header: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '32px',
      color: '#242424',
      textAlign: 'left',
      width: '100%'
    },
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    inputGroup: {
      position: 'relative',
      width: '100%'
    },
    input: {
      width: '100%',
      padding: '12px 12px 12px 40px',
      fontSize: '16px',
      borderRadius: '4px',
      border: '1px solid #E6E6E6',
      backgroundColor: '#FFFFFF',
      transition: 'border-color 0.3s ease',
      outline: 'none'
    },
    inputIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#757575'
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '500',
      backgroundColor: '#1A8917',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '99px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      marginTop: '16px'
    },
    forgotPassword: {
      fontSize: '14px',
      color: '#1A8917',
      textAlign: 'right',
      textDecoration: 'none',
      marginTop: '-10px'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '28px 0',
      color: '#757575',
      fontSize: '14px'
    },
    dividerLine: {
      flex: '1',
      height: '1px',
      backgroundColor: '#E6E6E6'
    },
    dividerText: {
      padding: '0 10px'
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      padding: '12px',
      border: '1px solid #E6E6E6',
      borderRadius: '99px',
      backgroundColor: '#FFFFFF',
      fontSize: '16px',
      fontWeight: '500',
      color: '#242424',
      cursor: 'pointer',
      marginBottom: '16px'
    },
    socialIcon: {
      marginRight: '12px',
      width: '18px',
      height: '18px'
    },
    footer: {
      marginTop: '48px',
      textAlign: 'center',
      color: '#757575',
      fontSize: '14px'
    },
    footerLink: {
      color: '#1A8917',
      textDecoration: 'none',
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.logo}>BlogName</div>
      
      <div style={styles.formContainer}>
        <h1 style={styles.header}>Welcome back.</h1>
        
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <Mail size={18} />
            </span>
            <input
              style={styles.input}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <span style={styles.inputIcon}>
              <Lock size={18} />
            </span>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <a href="#forgot-password" style={styles.forgotPassword}>
            Forgot password?
          </a>
          
          <button type="submit" style={styles.submitButton}>
            Sign in <ArrowRight size={18} />
          </button>
        </form>
        
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <div style={styles.dividerText}>or</div>
          <div style={styles.dividerLine}></div>
        </div>
        
        <button style={styles.socialButton}>
          <span style={styles.socialIcon}>G</span>
          Sign in with Google
        </button>
        
        <button style={styles.socialButton}>
          <span style={styles.socialIcon}>f</span>
          Sign in with Facebook
        </button>
        
        <div style={styles.footer}>
          No account? <a href="/signup" style={styles.footerLink}>Create one</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
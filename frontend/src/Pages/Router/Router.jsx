import React from 'react';
import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar/Sidebar';
import HomePage from '../HomePage/HomePage';
import Profile from '../Profile/Profile';
import CreateBlog from '../Create/CreateBlog';
import Login from '../../Components/Auth/Login';
import SignupPage from '../../Components/Auth/Signup';
import ArticleDetail from '../HomePage/ArticleDetail';
import LandPage from '../LandPage/LandPage';
import Bloggers from '../Bloggers/Bloggers';
import LandingPage from '../../Components/LandingPage/LandingPage';
import './MainLayout.css';
import { Menu } from 'lucide-react';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('userName');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const MainLayout = ({ toggleSidebar, isSidebarOpen }) => (
  <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
    {/* Sidebar */}
    <div
      className="sidebar-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: isSidebarOpen ? '20%' : '0',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'width 0.3s ease-in-out',
      }}
    >
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
    {/* Main Content Area */}
    <div
      className="content-container"
      style={{
        marginLeft: isSidebarOpen ? '20%' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        padding: '2rem',
        minHeight: '100vh',
        overflowY: 'auto',
        backgroundColor: '#f3f4f6',
      }}
    >
      <Outlet />
    </div>
  </div>
);

const Router = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <Routes>
      <Route element={<MainLayout toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />}>
        <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/:username" element={<Profile />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/others" element={<Bloggers />} />
        <Route path="/article/:articleId" element={<ArticleDetail />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* <Route path="/land" element={<LandPage />} /> */}
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
};

export default Router;

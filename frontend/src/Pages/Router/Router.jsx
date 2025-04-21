import React from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route ,Outlet} from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Profile from '../Profile/Profile';
import CreateBlog from '../Create/CreateBlog';
import Login from '../../Components/Auth/Login';
import SignupPage from '../../Components/Auth/Signup';

// Layout component for routes with sidebar
const MainLayout = () => (
  <div className="flex h-screen">
    {/* Fixed Sidebar */}
    <div className="w-[20%] border-r border-gray-200" style={{ position: 'fixed', top: 0, left: 0, height: '100%', overflow: 'hidden' }}>
      <Sidebar />
    </div>
    {/* Main Content Area */}
    <div className="flex-1 ml-[20%] p-6 bg-gray-100" style={{ padding: '2rem', minHeight: '100vh', overflowY: 'auto' }}>
    <Outlet />
    </div>
  </div>
);

const Router = () => {
  return (
    <Routes>
      {/* Routes with Sidebar */}
      <Route
        element={<MainLayout />}
      >
        <Route path="/" element={<HomePage />} />
        <Route path="/username" element={<Profile />} />
        <Route path="/create" element={<CreateBlog />} />
      </Route>
      {/* Routes without Sidebar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
};

export default Router;
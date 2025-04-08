import React from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../HomePage/HomePage';
import Profile from '../Profile/Profile';

const Router = () => {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="w-[20%] border-r border-gray-200" style={{ position: 'fixed', top: 0, left: 0, height: '100%', overflow: 'hidden' }}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-[20%] p-6 bg-gray-100" style={{ padding: '2rem', minHeight: '100vh', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/username" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default Router;
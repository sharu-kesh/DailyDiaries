// App.js
import React, { useState } from 'react';
import Router from './Pages/Router/Router';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Router toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default App;
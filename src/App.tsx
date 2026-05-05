import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminNewsEditor from './pages/AdminNewsEditor';
import Login from './pages/Login';
import News from './pages/News';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video/:id" element={<VideoPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/news/new" element={<AdminNewsEditor />} />
        <Route path="/admin/news/edit/:id" element={<AdminNewsEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </Router>
  );
}

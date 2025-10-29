import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProjectList from '@pages/ProjectList';

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="*" element={<div style={{ padding: 16 }}>404</div>} />
    </Routes>
  </BrowserRouter>
);

export default App;

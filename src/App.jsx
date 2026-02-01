import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/analyze" element={<Analyzer />} />
      </Routes>
    </Router>
  );
}

export default App;
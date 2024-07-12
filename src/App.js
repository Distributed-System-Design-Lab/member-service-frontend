// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
  <Router>
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <a className="navbar-brand" href="/">Spring Security OAuth - Authorization Code</a>
        </div>
      </div>
    </nav>
    <Routes>
      <Route path="/" element={<HomeComponent />} />
    </Routes>
  </Router>
);

export default App;

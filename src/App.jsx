import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage';
import PositionsPage from './components/PositionsPage';
import StudentsPage from './components/StudentsPage';
import LoginPage from './components/LoginPage';
import ReadmePage from './components/ReadmePage';
import ProtectedRoute from './components/ProtectedRoute';
import Message from './components/Message';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/positions" element={
                <ProtectedRoute>
                  <PositionsPage />
                </ProtectedRoute>
              } />
              <Route path="/readme" element={<ReadmePage />} />
            </Routes>
          </main>
          <Message />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

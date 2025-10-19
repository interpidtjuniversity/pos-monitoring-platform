import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const handlePositionsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/students');
  };
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>江月8班管理系统</h2>
        </div>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              首页
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/positions" 
              className={`nav-link ${location.pathname === '/positions' ? 'active' : ''}`}
              onClick={handlePositionsClick}
            >
              岗位列表
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/students" 
              className={`nav-link ${location.pathname === '/students' ? 'active' : ''}`}
            >
              人员列表
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/readme" 
              className={`nav-link ${location.pathname === '/readme' ? 'active' : ''}`}
            >
              系统说明
            </Link>
          </li>
          <li className={`nav-item login-item ${!isAuthenticated ? 'login-state' : ''}`}>
            {isAuthenticated ? (
              <button className="nav-button logout-button" onClick={handleLogout}>
                登出
              </button>
            ) : (
              <button 
                className="nav-button login-button" 
                onClick={() => navigate('/login')}
              >
                管理员登录
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
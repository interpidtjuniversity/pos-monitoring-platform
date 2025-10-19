import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>江月8班管理系统</h1>
        <p>高效管理班级岗位与人员信息</p>
      </header>
      
      <div className="home-content">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-number">25</div>
            <div className="stat-label">班级岗位</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">48</div>
            <div className="stat-label">参与同学</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">参与率</div>
          </div>
        </div>
        
        <div className="navigation-cards">
          <Link to="/positions" className="nav-card">
            <div className="card-icon">📋</div>
            <h3>岗位列表</h3>
            <p>查看所有班级岗位及成员信息</p>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/students" className="nav-card">
            <div className="card-icon">👥</div>
            <h3>人员列表</h3>
            <p>查看所有同学及扣分情况</p>
            <div className="card-arrow">→</div>
          </Link>

          <Link to="/readme" className="nav-card">
            <div className="card-icon">📝</div>
            <h3>系统说明</h3>
            <p>查看系统说明</p>
            <div className="card-arrow">→</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
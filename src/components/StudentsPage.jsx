import React, { useState, useEffect, useMemo } from 'react';
import { fetchStudentsData } from '../data/classData';
import { useNavigate } from 'react-router-dom';
import './StudentsPage.css';

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deduction'); // 'name', 'position', 'deduction'
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // 加载学生数据
  useEffect(() => {
    const loadStudentsData = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentsData();
        setStudentsData(data);
      } catch (error) {
        console.error('加载学生数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadStudentsData();
  }, []);
  
  const filteredAndSortedStudents = useMemo(() => {
    let filtered = studentsData.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.position.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'zh-CN');
      } else if (sortBy === 'position') {
        return a.position.localeCompare(b.position, 'zh-CN');
      } else if (sortBy === 'deduction') {
        return b.deductionCount - a.deductionCount;
      }
      return 0;
    });
  }, [searchTerm, sortBy, studentsData]);
  
  const getDeductionLevel = (count) => {
    if (count === 0) return { level: '无扣分', color: '#27ae60' };
    if (count <= 2) return { level: '轻微', color: '#f39c12' };
    return { level: '严重', color: '#e74c3c' };
  };
  
  // 显示加载状态
  if (loading) {
    return (
      <div className="students-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>正在加载学生数据...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="students-container">
      <header className="page-header">
        <h1>班级人员列表</h1>
        <p>共48名同学参与班级管理</p>
      </header>
      
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索姓名或岗位..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="sort-controls">
          <label>排序方式：</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="deduction">扣分次数</option>
            <option value="position">岗位</option>
            <option value="name">姓名</option>
          </select>
        </div>
      </div>
      
      <div className="students-stats">
        <div className="stat-card">
          <div className="stat-number">{studentsData.filter(s => s.deductionCount === 0).length}</div>
          <div className="stat-label">无扣分</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{studentsData.filter(s => s.deductionCount > 0 && s.deductionCount <= 2).length}</div>
          <div className="stat-label">轻微扣分</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{studentsData.filter(s => s.deductionCount > 2).length}</div>
          <div className="stat-label">严重扣分</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{studentsData.reduce((sum, s) => sum + s.deductionCount, 0)}</div>
          <div className="stat-label">总扣分次数</div>
        </div>
      </div>
      
      <div className="students-grid">
        {filteredAndSortedStudents.map(student => {
          const deductionInfo = getDeductionLevel(student.deductionCount);
          
          return (
            <div key={student.id} className="student-card">
              <div className="student-avatar">
                {student.name.charAt(0)}
              </div>
              <div className="student-info">
                <h3 className="student-name">{student.name}</h3>
                <p className="student-position">{student.position}</p>
              </div>
              <div className="deduction-info">
                <div 
                  className="deduction-count" 
                  style={{ color: deductionInfo.color }}
                >
                  {student.deductionCount}
                </div>
                <div 
                  className="deduction-level"
                  style={{ backgroundColor: deductionInfo.color }}
                >
                  {deductionInfo.level}
                </div>
              </div>

              <div className="score-info">
                <div className="score-label">预计得分</div>
                <div className="score-value">
                  {student.workload + student.deduction_factor * student.num_malfeasance_avg - student.deduction_factor * student.deductionCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentsPage;
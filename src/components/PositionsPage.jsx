import React, { useState, useContext, useEffect } from 'react';
import { fetchPositionsData } from '../data/classData';
import { useAuth } from '../contexts/AuthContext';
import './PositionsPage.css';

const PositionsPage = () => {
  const { token } = useAuth();
  const [positionsData, setPositionsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPosition, setExpandedPosition] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [editingField, setEditingField] = useState(null); // 添加编辑状态
  const [editValues, setEditValues] = useState({}); // 存储编辑的值
  const [currentReport, setCurrentReport] = useState({
    positionName: '',
    memberNames: [],
    malpracticeList: []
  });
  const [currentManagePosition, setCurrentManagePosition] = useState({
    name: '',
    malpracticeList: []
  });
  const [newMalpractice, setNewMalpractice] = useState('');

  // 获取岗位数据
  useEffect(() => {
    const getPositionsData = async () => {
      try {
        setLoading(true);
        const data = await fetchPositionsData();
        setPositionsData(data);
      } catch (error) {
        console.error('获取岗位数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    getPositionsData();
  }, []);

  // 表单数据状态
  const [formData, setFormData] = useState({
    date: '',
    weekday: '',
    timerange: '',
    position: '',
    members: '',
    event: ''
  });

  const togglePosition = (id) => {
    if (expandedPosition === id) {
      setExpandedPosition(null);
    } else {
      setExpandedPosition(id);
    }
  };

  const toggleMemberSelection = (positionId, memberName) => {
    const key = `${positionId}-${memberName}`;
    setSelectedMembers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleReportClick = async (positionName, positionId) => {
    // 根据positionId找到对应的position
    const position = positionsData.find(p => p.id === positionId);
    if (!position) {
      window.showMessage('找不到对应的岗位信息', 'error');
      return;
    }
    
    // 获取所有选中的成员
    const selectedMemberNames = position.members.filter(member => {
      const key = `${positionId}-${member}`;
      return selectedMembers[key];
    });
    
    if (selectedMemberNames.length === 0) {
      window.showMessage('请至少选择一名成员', 'warning');
      return;
    }
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/job_malpractice?name=${encodeURIComponent(positionName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.result) {
        setCurrentReport({
          positionName,
          memberNames: selectedMemberNames,
          malpracticeList: data.malpractice
        });
        
        // 初始化表单数据
        setFormData({
          date: '',
          weekday: '',
          timerange: '',
          position: positionName,
          members: selectedMemberNames.join(','),
          event: ''
        });
        
        setShowReportModal(true);
      } else {
        window.showMessage('获取违规事件列表失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('请求违规事件列表失败:', error);
      window.showMessage('请求违规事件列表失败，请检查网络连接', 'error');
    }
  };

  const closeModal = () => {
    setShowReportModal(false);
    // 重置表单数据
    setFormData({
      date: '',
      weekday: '',
      timerange: '',
      position: '',
      members: '',
      event: ''
    });
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理管理按钮点击
  const handleManageClick = async (positionName) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/job_malpractice?name=${encodeURIComponent(positionName)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.result) {
        setCurrentManagePosition({
          name: positionName,
          malpracticeList: data.malpractice || []
        });
        setShowManageModal(true);
      } else {
        window.showMessage('获取渎职类型列表失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('请求渎职类型列表失败:', error);
      window.showMessage('请求渎职类型列表失败，请检查网络连接', 'error');
    }
  };

  // 关闭管理弹窗
  const closeManageModal = () => {
    setShowManageModal(false);
    setNewMalpractice('');
  };

  // 添加渎职类型
  const handleAddMalpractice = async () => {
    if (!newMalpractice.trim()) {
      window.showMessage('请输入渎职类型', 'warning');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/add_job_malpractice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentManagePosition.name,
          malpractice: newMalpractice
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        // 更新本地列表
        setCurrentManagePosition(prev => ({
          ...prev,
          malpracticeList: [...prev.malpracticeList, newMalpractice]
        }));
        setNewMalpractice('');
        window.showMessage('添加成功', 'success');
      } else {
        window.showMessage('添加渎职类型失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('添加渎职类型失败:', error);
      window.showMessage('添加渎职类型失败，请检查网络连接', 'error');
    }
  };

  // 删除渎职类型
  const handleDeleteMalpractice = async (malpractice) => {
    if (!window.confirm(`确定要删除"${malpractice}"吗？`)) {
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/remove_job_malpractice', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentManagePosition.name,
          malpractice: malpractice
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        // 更新本地列表
        setCurrentManagePosition(prev => ({
          ...prev,
          malpracticeList: prev.malpracticeList.filter(item => item !== malpractice)
        }));
        window.showMessage('删除成功', 'success');
      } else {
        window.showMessage('删除渎职类型失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('删除渎职类型失败:', error);
      window.showMessage('删除渎职类型失败，请检查网络连接', 'error');
    }
  };

  // 处理双击编辑
  const handleDoubleClick = (positionId, field, value) => {
    setEditingField(`${positionId}-${field}`);
    setEditValues({
      ...editValues,
      [`${positionId}-${field}`]: value
    });
  };

  // 处理输入变化
  const handleEditChange = (positionId, field, value) => {
    // 只允许输入数字
    const numericValue = value.replace(/[^0-9.]/g, '');
    setEditValues({
      ...editValues,
      [`${positionId}-${field}`]: numericValue
    });
  };

  // 处理失焦保存
  const handleBlur = async (positionId, positionName, field) => {
    const key = `${positionId}-${field}`;
    const value = editValues[key];
    
    // 如果值为空或未变化，则不发送请求
    if (!value || value === '') {
      setEditingField(null);
      return;
    }
    
    try {
      let url, paramName;
      
      if (field === 'workload') {
        url = 'http://127.0.0.1:5000/change_workload';
        paramName = 'workload';
      } else if (field === 'deduction_factor') {
        url = 'http://127.0.0.1:5000/change_deduction_factor';
        paramName = 'deduction_factor';
      }
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: positionName,
          [paramName]: value
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        // 更新本地数据
        setPositionsData(prev => prev.map(position => 
          position.id === positionId 
            ? { ...position, [field]: value }
            : position
        ));
        window.showMessage('更新成功', 'success');
      } else {
        window.showMessage('更新失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('更新失败:', error);
      window.showMessage('更新失败，请检查网络连接', 'error');
    }
    
    setEditingField(null);
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单校验
    const requiredFields = ['date', 'weekday', 'timerange', 'position', 'members', 'event'];
    const emptyFields = requiredFields.filter(field => {
      const value = formData[field];
      return !value || value.trim() === '';
    });
    
    if (emptyFields.length > 0) {
      const fieldNames = {
        date: '日期',
        weekday: '星期',
        timerange: '时间段',
        position: '岗位',
        members: '人员',
        event: '事件'
      };
      
      const missingFields = emptyFields.map(field => fieldNames[field]).join('、');
      window.showMessage(`请填写以下必填项：${missingFields}`, 'warning');
      return;
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/submit_malpractice_record', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: formData.date,
          weekday: formData.weekday,
          timerange: formData.timerange,
          position: formData.position,
          members: formData.members,
          event: formData.event
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        window.showMessage('上报成功', 'success');
        closeModal();
      } else {
        window.showMessage('上报失败：' + data.message, 'error');
      }
    } catch (error) {
      console.error('上报失败:', error);
      window.showMessage('上报失败，请检查网络连接', 'error');
    }
  };

  return (
    <div className="positions-container">
      <header className="page-header">
        <h1>班级岗位列表</h1>
        <p>共25个岗位，48名同学参与班级管理</p>
      </header>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>正在加载岗位数据...</p>
        </div>
      ) : (
        <div className="positions-list">
          {positionsData.map(position => (
            <div key={position.id} className="position-card">
              <div 
                className="position-header"
                onClick={() => togglePosition(position.id)}
              >
                <div className="position-info">
                  <h3 className="position-name">{position.name}</h3>
                  <p className="position-description">{position.description}</p>
                </div>
                <div className="position-meta">
                  <span className="member-count">{position.members.length}人</span>
                  <div className="editable-fields">
                    <div className="editable-field">
                      <span className="field-label">岗位分:</span>
                      {editingField === `${position.id}-workload` ? (
                        <input
                          type="text"
                          className="editable-input"
                          value={editValues[`${position.id}-workload`] || ''}
                          onChange={(e) => handleEditChange(position.id, 'workload', e.target.value)}
                          onBlur={() => handleBlur(position.id, position.name, 'workload')}
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="editable-value"
                          onDoubleClick={() => handleDoubleClick(position.id, 'workload', position.workload)}
                          title="双击编辑"
                        >
                          {position.workload}
                        </span>
                      )}
                    </div>
                    <div className="editable-field">
                      <span className="field-label">扣分因数:</span>
                      {editingField === `${position.id}-deduction_factor` ? (
                        <input
                          type="text"
                          className="editable-input"
                          value={editValues[`${position.id}-deduction_factor`] || ''}
                          onChange={(e) => handleEditChange(position.id, 'deduction_factor', e.target.value)}
                          onBlur={() => handleBlur(position.id, position.name, 'deduction_factor')}
                          autoFocus
                        />
                      ) : (
                        <span 
                          className="editable-value"
                          onDoubleClick={() => handleDoubleClick(position.id, 'deduction_factor', position.deduction_factor)}
                          title="双击编辑"
                        >
                          {position.deduction_factor}
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    className="manage-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageClick(position.name);
                    }}
                  >
                    管理
                  </button>
                  <span className={`expand-icon ${expandedPosition === position.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>
              
              {expandedPosition === position.id && (
                <div className="position-members">
                  <h4>岗位成员：</h4>
                  <div className="members-list">
                    {position.members.map((member, index) => {
                      const key = `${position.id}-${member}`;
                      const isSelected = selectedMembers[key] || false;
                      return (
                        <div 
                          key={index} 
                          className={`member-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => toggleMemberSelection(position.id, member)}
                        >
                          <div className="member-checkbox">
                            <input
                              type="checkbox"
                              id={key}
                              checked={isSelected}
                              onChange={() => toggleMemberSelection(position.id, member)}
                            />
                            <label htmlFor={key}></label>
                          </div>
                          <div className="member-avatar">
                            {member.charAt(0)}
                          </div>
                          <span className="member-name">{member}</span>
                        </div>
                      );
                    })}
                    <button 
                      className="report-button"
                      onClick={() => handleReportClick(position.name, position.id)}
                      disabled={!position.members.some(m => {
                        const key = `${position.id}-${m}`;
                        return selectedMembers[key];
                      })}
                    >
                      上报
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>岗位违规上报</h3>
              <button className="close-button" onClick={closeModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>日期选择：<span className="required">*</span></label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>星期选择：<span className="required">*</span></label>
                <select name="weekday" value={formData.weekday} onChange={handleInputChange}>
                  <option value="">请选择</option>
                  <option value="周一">周一</option>
                  <option value="周二">周二</option>
                  <option value="周三">周三</option>
                  <option value="周四">周四</option>
                  <option value="周五">周五</option>
                  <option value="周六">周六</option>
                  <option value="周日">周日</option>
                </select>
              </div>
              <div className="form-group">
                <label>时间段选择：<span className="required">*</span></label>
                <select name="timerange" value={formData.timerange} onChange={handleInputChange}>
                  <option value="">请选择</option>

                  <option value="课间1">课间1</option>
                  <option value="早1">早1</option>
                  <option value="课间2">课间2</option>
                  <option value="第一节课">第一节课</option>
                  <option value="课间3">课间3</option>
                  <option value="第二节课">第二节课</option>
                  <option value="课间4">课间4</option>
                  <option value="第三节课">第三节课</option>
                  <option value="课间5">课间5</option>
                  <option value="第四节课">第四节课</option>
                  <option value="课间6">课间6</option>
                  <option value="第五节课">第五节课</option>

                  <option value="午休">午休</option>
                  
                  <option value="第六节课">第六节课</option>
                  <option value="课间7">课间7</option>
                  <option value="第七节课">第七节课</option>
                  <option value="课间8">课间8</option>
                  <option value="第八节课">第八节课</option>
                  <option value="课间9">课间9</option>

                  <option value="课后服务1">课后服务1</option>
                  <option value="课间10">课间10</option>
                  <option value="课后服务2">课后服务2</option>
                  <option value="课间11">课间11</option>
                  <option value="课后服务3">课后服务3</option>
                  <option value="课间12">课间12</option>
                </select>
              </div>
              <div className="form-group">
                <label>岗位：<span className="required">*</span></label>
                <input type="text" name="position" value={formData.position} readOnly />
              </div>
              <div className="form-group">
                <label>人员：<span className="required">*</span></label>
                <input type="text" name="members" value={formData.members} readOnly />
              </div>
              <div className="form-group">
                <label>事件：<span className="required">*</span></label>
                <select name="event" value={formData.event} onChange={handleInputChange}>
                  <option value="">请选择</option>
                  {currentReport.malpracticeList.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="submit-button" onClick={handleSubmit}>提交</button>
              <button className="cancel-button" onClick={closeModal}>取消</button>
            </div>
          </div>
        </div>
      )}
      
      {showManageModal && (
        <div className="modal-overlay">
          <div className="modal-content manage-modal">
            <div className="modal-header">
              <h3>管理渎职类型 - {currentManagePosition.name}</h3>
              <button className="close-button" onClick={closeManageModal}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="malpractice-table-container">
                <table className="malpractice-table">
                  <thead>
                    <tr>
                      <th>编号</th>
                      <th>描述</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentManagePosition.malpracticeList.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item}</td>
                        <td>
                          <button 
                            className="delete-button"
                            onClick={() => handleDeleteMalpractice(item)}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="add-malpractice-container">
                <input
                  type="text"
                  className="add-malpractice-input"
                  placeholder="输入新的渎职类型"
                  value={newMalpractice}
                  onChange={(e) => setNewMalpractice(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMalpractice()}
                />
                <button 
                  className="add-button"
                  onClick={handleAddMalpractice}
                >
                  添加
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeManageModal}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionsPage;
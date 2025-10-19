import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ReadmePage.css';

const ReadmePage = () => {
  // 默认的Markdown内容
  const defaultMarkdown = `
# 岗位分介绍

## 1. 职务基础分

- 职务基础分与职务工作量成正比
- 职务工作量量化为三个等级：低、中、高
- 每个等级的职务基础分分别为: 低（5分）、中（10分）、高（15分）可以动态调节

## 2. 职务历史失职平均值

- 按周统计每个职务失职次数的平均值 = 每个周职务失职次数 / 该职务人数
- 计算每个职务历史失职平均值公式为 = 之前所有周职务失职次数的平均值
- 职务历史失职平均值应该为本周应该达成的目标，本周失职次数不得多于该值
- 例如: 一个职务有2位成员，前三周分别有2次、2次、4次失职，那么该职务的历史失职平均值为(2 / 2+2 / 2+3 / 2) / 3 = 1.17次，四舍五入为1次

## 3. 职务附加分

- 职务附加分 = 附加分因数（2，可以动态调节）* 职务历史失职平均值
- 职务实际附加分得分 = 职务附加分 - 附加分因数（2，可以动态调节） * 本周职务失职次数
- 例如: 职务历史失职平均值为1次，本周职务失职次数为2，那么职务实际附加分得分为2 * 1 - 2 * 2 = -2分
- 例如: 职务历史失职平均值为10次，本周职务失职次数为0，那么职务实际附加分得分为2 * 10 - 2 * 0 = 20分

## 4. 周职务总分

- 周职务总分 = 职务基础分 + 职务实际附加分得分

---

## 联系方式

如有问题或建议，请联系：
- **QQ**: 120571672
- **电话**: 18817412292

---

*最后更新时间: 2025-10-19*`;

  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // 这里可以添加保存到后端的逻辑
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 恢复原始内容
    setMarkdown(defaultMarkdown);
  };

  const handleChange = (e) => {
    setMarkdown(e.target.value);
  };

  return (
    <div className="readme-container">
      <div className="readme-header">
        <h1>岗位分介绍</h1>
        {/* <div className="readme-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>保存</button>
              <button className="cancel-btn" onClick={handleCancel}>取消</button>
            </>
          ) : (
            <button className="edit-btn" onClick={handleEdit}>编辑</button>
          )}
        </div> */}
      </div>
      
      <div className="readme-content">
        {isEditing ? (
          <textarea
            className="markdown-editor"
            value={markdown}
            onChange={handleChange}
            rows={20}
          />
        ) : (
          <div className="markdown-preview">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadmePage;
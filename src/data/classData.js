// 从API获取班级岗位和人员数据

// 获取岗位数据
export const fetchPositionsData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/students_jobs');
    const result = await response.json();
    
    if (result.result) {
      // 转换API返回的数据格式为组件需要的格式
      return result.data.map((item, index) => ({
        id: index + 1, // 添加id字段，使用索引+1作为唯一标识
        name: item.name,
        description: item.duty, // 将duty映射为description
        members: item.member, // 将member映射为members
        workload: item.workload,
        num_malfeasance_avg: item.num_malfeasance_avg,
        deduction_factor: item.deduction_factor,
      }));
    } else {
      console.error('获取岗位数据失败:', result.message);
      return [];
    }
  } catch (error) {
    console.error('请求岗位数据出错:', error);
    return [];
  }
};

// 获取学生数据
export const fetchStudentsData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/students_pos_score');
    const result = await response.json();
    
    if (result.result) {
      // 转换API返回的数据格式为组件需要的格式
      return result.data.map((item, index) => ({
        id: index + 1, // 添加id字段，使用索引+1作为唯一标识
        name: item.name,
        position: item.position,
        duty: item.duty,
        workload: item.workload || 0,
        num_malfeasance_avg: item.num_malfeasance_avg || 0,
        deduction_factor: item.deduction_factor || 1, // 添加默认值
        records: item.records,
        deductionCount: item.deductionCount || 0
      }));
    } else {
      console.error('获取学生数据失败:', result.message);
      return [];
    }
  } catch (error) {
    console.error('请求学生数据出错:', error);
    return [];
  }
};
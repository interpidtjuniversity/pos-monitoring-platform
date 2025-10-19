import React, { useState, useEffect } from 'react';
import './Message.css';

const Message = () => {
  const [messages, setMessages] = useState([]);

  // 添加消息
  const addMessage = (content, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, content, type }]);
    
    // 3秒后自动移除消息
    setTimeout(() => {
      removeMessage(id);
    }, 3000);
  };

  // 移除消息
  const removeMessage = (id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  // 暴露方法到全局
  useEffect(() => {
    window.showMessage = addMessage;
    return () => {
      delete window.showMessage;
    };
  }, []);

  return (
    <div className="message-container">
      {messages.map(msg => (
        <div 
          key={msg.id} 
          className={`message message-${msg.type}`}
          onClick={() => removeMessage(msg.id)}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
};

export default Message;
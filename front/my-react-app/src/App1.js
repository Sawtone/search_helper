import logo from './logo.svg';
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [inputText, setInputText] = useState('');
  const [serverResponse, setServerResponse] = useState(''); // 服务器响应的文本


  const sendToServer = () => {
    const NODE_SERVER_URL = 'http://127.0.0.1:5000/api/analyze';
    axios.post(NODE_SERVER_URL, {
      text: inputText,
      history: [] // 如果您有历史消息的话
    })
    .then(response => {
      // 请求成功后更新 serverResponse 状态以显示服务器响应
      setServerResponse(response.data.result || 'No response body.');
    })
    .catch(error => {
      // 请求失败后更新 serverResponse 状态以显示错误信息
      setServerResponse('Error sending data to the server.');
      console.error('There was an error!', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="请输入内容"
        />
        <button onClick={sendToServer}>确定</button>
        <p>我们的建议:</p>
        <textarea
          id="8848"
          value={serverResponse}
          readOnly
          style={{ width: '300px', height: '100px' }}
        />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn us
        </a>
      </header>
    </div>
  );
}

export default App;

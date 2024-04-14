import logo from './logo.svg';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';



import './App.css';

function InputWithPrefixButtons({ inputText, setInputText, sendToServer }) {
  const usedPrefixes = useRef([]); // 用于存储已经使用过的前缀

  const addPrefix = (prefix) => {
    if (!usedPrefixes.current.includes(prefix)) { // 如果前缀未被使用过
      setInputText(prefix); // 清空输入文本并设置为当前前缀
      usedPrefixes.current = [prefix]; // 重置已使用的前缀列表
    }
  };

  const clearInput = () => {
    setInputText("");
  };
  
  return (
    <div className='prefix'>
      <button onClick={() => addPrefix('bilibili:')} id='1' className="prefix-button bilibili-button">b站</button>
      <button onClick={() => addPrefix('tiktok:')} id='2' className="prefix-button tiktok-button">抖音</button>
      <button onClick={() => addPrefix('youtube:')} id='3' className="prefix-button youtube-button">油管</button>
      <button onClick={() => clearInput()} id='4' className="prefix-button delete-button">清空</button>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [serverResponse, setServerResponse] = useState(''); // 服务器响应的文本

  const sendToServer = () => {
    const NODE_SERVER_URL = 'http://127.0.0.1:5000/api/analyze';
    axios
      .post(NODE_SERVER_URL, {
        text: inputText,
        history: [] // 如果您有历史消息的话
      })
      .then((response) => {
        // 请求成功后更新 serverResponse 状态以显示服务器响应
        setServerResponse(response.data.result || 'No response body.');
      })
      .catch((error) => {
        // 请求失败后更新 serverResponse 状态以显示错误信息
        setServerResponse('Error sending data to the server.');
        console.error('There was an error!', error);
      });
  };

  return (
    <Router>
      <meta charSet='utf-8'/>
    <div className="App">
      <div className="App-header">
        <header className='header'>
          <img src={logo} className="App-logo" alt="logo" />

          <div className='side'>
        
        <p className='y'>剃刀——“如无必要，勿增实体”</p>
      </div>  


        </header>
      </div>
      <div className="Content">
          <div className='left'>
            <p className='p'>可选插件  </p>
            <button >***</button>
          </div>
        <div className='content'>
        <div >
          <img src={process.env.PUBLIC_URL + '/LMlogo.png'} alt="LM" className='lmlogo' />
          <div className='o'>Razor内容推荐 - InternLM提供支持</div>
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            placeholder="请输入内容"
            className="input-field"
            id="myInput"
            onChange={(e) => setInputText(e.target.value)}
          />
          <button className="button-field" onClick={sendToServer}>
            确定
          </button>
              </div>
              <div>
          <InputWithPrefixButtons inputText={inputText} setInputText={setInputText} sendToServer={sendToServer} />
          </div>
        <div className='output-container'>
          <p>我们的建议:</p>
          <textarea value={serverResponse} readOnly className="output-field"></textarea>
          <br />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn More
          </a>
        </div>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;

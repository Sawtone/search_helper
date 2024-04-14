// 导入模块
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const axios = require('axios'); // 用于发送HTTP请求到大模型API

const cors = require('cors');
const analyse = require('./analyse');


const app = express();
app.use(bodyParser.json()); // 支持JSON格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); // 支持编码的请求体
app.use(cors()); // 使用默认配置，允许所有跨域请求

const PYTHON_SERVER_URL = 'http://127.0.0.1:6006/analyze'; // Python服务的URL

/* 设置跨域访问
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
*/


// API 端点，用于接收来自前端的文本数据，并将其发送到 Flask 服务
app.post('/api/analyze', async (req, res) => {
    try {
        const userInput = req.body.text;
        const history = req.body.history || []; // 如果前端发送了历史消息，则包含它们
        // 发送请求到 Flask 服务
        let type = 0;

        let keywords = userInput;
        if(type === 0){
            this.table = "bytext";
            this.Data = null;       
        }
        else{
            this.table = "byurl";
            this.Data = axios.post(PYTHON_SERVER_URL, { text: userInput, history: history });
        }


        analyse.getVideoInfo_by_Input(type, keywords, this.table, this.Data, (err, result) => {
            if (err) {
                console.log("获取数据失败");

            }
            else{
                if(result){
                    
                    console.log("获取数据成功");
                    
                    if(type === 1){
                        res.json(result);
                    }
                    else{
                        let content = "";
                        for(let it of result){
                            content = content + `<a href="${it.url}">`+it.videoName+"</a>\n"
                        }
                        console.log(content);

                        //document.getElementById("8848").innerHTML = content;
                        res.json({"result": content});
                    }
                    
                }
            }
        
        });

    //    const response = await axios.post(PYTHON_SERVER_URL, { text: userInput, history: history });
        // 将结果返回给前端
    //    res.json(response.data);
    } catch (error) {
        // 如果与 Flask 服务通信出错，返回错误信息
        console.error('Error communicating with the Python service:', error);
        res.status(500).send('Error communicating with the Python service');
    }
});



//////////////////////////////////////////////////////////////////////////
/*
// MySQL数据库连接设置
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'MYSQL',
    password: 'abc123456789',
    database: 'wangxin'
});

// 建立数据库连接
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

// 示例数据库操作
function saveAnalysisResult(data) {
    // 实现将分析结果保存到数据库的逻辑
}

function getAnalysisResults() {
    // 实现从数据库检索分析结果的逻辑
}

//////////////////////////////////////////////////////////////////////////

// API路由设置

// API路由：处理分析请求
app.post('/api/analyze', async (req, res) => {
    const inputText = req.body.text;
    const analysisResult = await callModelAPI(inputText);

    if (analysisResult) {
        // 存储结果到数据库
        const query = 'INSERT INTO analysis_results (content, result) VALUES (?, ?)';
        connection.query(query, [inputText, JSON.stringify(analysisResult)], (error, results) => {
            if (error) {
                res.status(500).send('Error saving the analysis result');
            } else {
                res.status(200).send({ id: results.insertId, ...analysisResult });
            }
        });
    } else {
        res.status(500).send('Error analyzing the text');
    }
});
app.get('/api/results', (req, res) => {
    // 此处添加检索分析结果的逻辑
});

// API路由：检索分析结果
app.get('/api/results', (req, res) => {
    const query = 'SELECT * FROM analysis_results';
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).send('Error retrieving results');
        } else {
            res.status(200).json(results);
        }
    });
});
*/
//////////////////////////////////////////////////////////////////////////

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const mysql = require("mysql")

class dbConnectClass {
    DBConnect(database) {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'abc123456789',
            database: database,
            port: 3306
        });

        connection.connect((err) => {
            if (err) {
                console.error('无法连接到数据库: ' + err.stack);
                return;
            }
            console.log('成功连接到数据库' + connection.threadId);
        });
        return connection;
    }

    SQL_Operate(database, type, sql, data, callback) {
        const connect = this.DBConnect(database);
        switch (type) {
            case "insert":{
                connect.query(sql, data,(err, results) => {
                    if (err) {
                        console.error('插入数据时出错: ' + err.stack);
                        callback(err,null)
                    }
                    // console.log('成功插入数据，插入的行ID为: ' + results.insertId);
                    callback(null,results)
                });
                break;
            }
            case "update":{
                connect.query(sql,data,(err, results) => {
                    if (err) {
                        console.error('更改数据时出错: ' + err.stack);
                        callback(err,null)
                    }
                    callback(null,results)
                })
                break;
            }
            case "delete":{
                connect.query(sql, data, (err, results) => {
                    if (err) {
                        console.error('删除数据时出错: ' + err.stack);
                        callback(err,null)
                    }
                    // 输出受影响的行数
                    console.log('成功删除 ' + results.affectedRows + ' 行数据');
                    callback(null,results)
                })
                break;
            }
            case "select":{
                connect.query(sql, (err, results) => {
                    if (err) {
                        console.error('Error executing query: ' + err.stack);
                        callback(err,null)
                    }
                    // console.log('Query result:', results);
                    callback(null,results)
                });
                break;
            }
            default:{
                console.log("输入type有误！");
                break;
            }
        }
        connect.end((err) => {
            if (err) {
                console.error('关闭数据库连接时出错： ' + err.stack);
                return;
            }
            console.log('数据库连接已关闭'+connect.threadId);
        });
    }
}

module.exports = {dbConnect: new dbConnectClass()};
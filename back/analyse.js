const {dbConnect} = require("./dbConnect");

class analyse {
    getVideoInfo_by_Input(keyType, keywords, table, data, callback) {
        this.inputInTable_IF(keyType, keywords, table, (err, result) => {
            if (err) {
                console.error("001检测失败");
                callback(err, null);
            }
            if (result[0] === 1) {
                if (keyType === 0) {
                    console.log(`002.关键词：'${keywords.replace("bili_", "")}'存在表中`);
                } else {
                    console.log(`002.URL：'${keywords}'存在表中`);
                }
                callback(null, result[1]);
                return;
            }
            if (result[0] === 0) {

                let sql_insertTo_content = `INSERT INTO content SET ?`;
                let data_insertTo_content = {
                    Type: keyType,
                    Content: keywords
                };
                dbConnect.SQL_Operate("internlm", "insert", sql_insertTo_content, data_insertTo_content, (err, result) => {
                    if (err) {
                        console.error("003插入数据出错");
                    }
                    if (result) {
                        console.log("004成功插入数据：" + result.insertId);
                    }
                });
                if (keyType === 0) {

                    let newkeywords = keywords.replace("bili_", "");
                    // let sql_select01 = `SELECT * FROM video_data WHERE keywords LIKE '%${newkeywords}%' OR videoName LIKE '%${newkeywords}%' OR author LIKE '%${newkeywords}%'`;
                    let sql_select01 = `SELECT * FROM video_data WHERE keywords LIKE '%${newkeywords}%' OR videoName LIKE '%${newkeywords}%'`;
                    dbConnect.SQL_Operate("internlm", "select", sql_select01, null, (err, result) => {
                        if (err) {
                            console.error("005查询数据出错");
                        }
                        if (result) {
                            let newResult = [];
                            for (let it of result) {
                                let dateInfo = it.upDate.split("-");
                                let date;
                                if (dateInfo.length === 2) {
                                    date = new Date(2024, parseInt(dateInfo[0]) - 1, parseInt(dateInfo[1]));
                                } else {
                                    date = new Date(parseInt(dateInfo[0]), parseInt(dateInfo[1]) - 1, parseInt(dateInfo[2]));
                                }
                                const timestamp = date.getTime();
                                let weight = Math.round(0.05 * Math.log(1 + it.Watch) + 0.1 * it.Like + 0.5 * it.Coining + 0.2 * it.Collect + 0.12 * it.Share + 0.3 * it.commentNum + 0.01 * Math.exp(timestamp * 1e-11));
                                let newIt = {
                                    Content: keywords,
                                    videoName: it.videoName,
                                    url: it.URL,
                                    recommend_weight: weight
                                }
                                newResult.push(newIt);
                            }
                            const seenUrls = new Set();
                            newResult = newResult.filter(item => {
                                if (!seenUrls.has(item.url)) {
                                    seenUrls.add(item.url);
                                    return true;
                                }
                                return false;
                            });
                            newResult.sort((a, b) => b.recommend_weight - a.recommend_weight);
                            const newResult1 = newResult.slice(0, 10);
                            const newInsert_SearchData_sql = 'INSERT INTO bytext (Content, videoName, url, recommend_weight) VALUES ?';
                            const values = newResult1.map(item => [item.Content, item.videoName, item.url, item.recommend_weight]);
                            dbConnect.SQL_Operate("internlm", "insert", newInsert_SearchData_sql, [values], (err, result) => {
                                if (err) {
                                    console.error("006插入数据出错");
                                }
                                console.log("007成功插入数据：" + result.insertId);
                            })
                            callback(null, newResult1);
                        }
                    });
                } else {
                    console.error("0123" + table);
                    let insertData_byurl_sql = `INSERT INTO ${table} SET ?`
                    let newData = this.convertAPIdata(data)
                    let insertData_byurl_data = {
                        Content: keywords,
                        Num: newData[0],
                        Text: newData[1]
                    }
                    // dbConnect.SQL_Operate("internlm", "insert", insertData_byurl_sql, insertData_byurl_data, (err, result) => {
                    //     if (err) {
                    //         console.error("011数据插入失败");
                    //     }
                    //     console.error("012数据插入成功");
                    // })
                    callback(null, [insertData_byurl_data])
                }

            }
        });
    }

    inputInTable_IF(keyType, keywords, table, callback) {
        //检测keywords是否存在于content表中
        let keyNotInTable_sql = `SELECT * FROM content  WHERE Content = '${keywords}' AND Type = '${keyType}'`;

        dbConnect.SQL_Operate('internlm', "select", keyNotInTable_sql, null, (err, result) => {
            if (err) {
                console.error("008查询失败");
            }
            if (result.length === 0) {
                if (keyType === 0) {
                    console.log(`009关键词：'${keywords.replace("bili_", "")}'不存在表中`);
                }
                callback(null, [0, result]);
            } else {
                //如果存在则直接从已分析过的数据库调取数据
                let keyInTable_sql = `SELECT * FROM ${table} WHERE Content = '${keywords}'`;
                dbConnect.SQL_Operate('internlm', "select", keyInTable_sql, null, (err, result) => {
                    if (err) {
                        console.error("010查询失败");
                    }
                    callback(null, [1, result]);
                });
            }
        });

    }

    convertAPIdata(data) {
        return [0, data.result]
    }
}

module.exports = new analyse();
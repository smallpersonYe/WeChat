
const {parseString} = require('xml2js');
module.exports = {
    //获取到了用户发送过来的消息
    getUserDataAsync (request) {
        return new Promise((resolve, reject) => {
            let xmlData = '';
            request
                .on('data', data => {
                    xmlData += data.toString();
                })
                .on('end', () => {
                    //说明数据接收完毕
                    resolve(xmlData);
                })
        });
    },
    //将xml数据解析为js对象
    parseXMLData (xmlData) {
        let jsData = null;

        parseString(xmlData, {trim: true}, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        });
        return jsData;
    },
    //格式化js对象的方法
    formatJsData (jsData) {
        const {xml} = jsData;
        let userData = {};
        for (let key in xml) {
            //获取到属性值
            const value = xml[key];
            //去掉数组
            userData[key] = value[0];
        }
        return userData;
    }


};
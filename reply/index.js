const sha1 = require('sha1');
const {getUserDataAsync, parseXMLData, formatJsData} = require('../utils/tools');
const template = require('./template');
const handleResponse = require('./handleResponse');
module.exports = () => {
    return async (request,response) => {
        //微信服务器发送过来的请求参数
        // console.log(request.query);
        const {signature, echostr, timestamp, nonce} = request.query;
        const token = 'smallpersonYe161005';
        //将token,timestamp, nonce三个参数进行排序
        const sortedArr = [token, timestamp, nonce].sort();
        // console.log(sortedArr);
        //将三个参数字符串拼接成一个字符串进行sha1加密
        const sha1str = sha1(sortedArr.join(''));
        // console.log(sha1str);

        if (request.method === 'GET') {
            //开发者获得加密后的字符串可与signature对比, 标识该请求来源于微信   gh_7705b52cbef9
            if (sha1str === signature) {
                //说明消息来自于微信服务器
                response.end(echostr);
            } else {
                //说明消息不是微信服务器
                response.end('error');
            }
        } else if (request.method === 'POST') {
            //过滤掉不是微信服务器发送过来的消息
            if (sha1str !== signature) {
                response.end('error');
                return;
            }
            //获取到了用户发送过来的消息
            const xmlData = await getUserDataAsync(request);

            const jsData = parseXMLData(xmlData);
            //格式化jsData
            const userData = formatJsData(jsData);
            // console.log(userData.Content);

            //实现自动回复
            const options = handleResponse(userData);

            const replyMessage = template(options);
            console.log(replyMessage);
            //返回响应
            response.send(replyMessage);
        } else {
            response.end('error');
        }

    }
};
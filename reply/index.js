const sha1 = require('sha1');
const {getUserDataAsync, parseXMLData, formatJsData} = require('../untils/tools');
const template = require('./template');
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
            console.log(userData.Content);

            //实现自动回复
            let options = {
                toUserName: userData.FromUserName,
                fromUserName: userData.ToUserName,
                createTime: Date.now(),
                type: 'text',
                content: '你说啥玩意呢,赶紧滚'
            };

            if (userData.Content === '在吗') {
                options.content = '不在,没工夫搭理你';
            }else if (userData.Content && userData.Content.indexOf('滚') !== -1) {
                options.content = '你说谁呢? \n 王八犊子';
            }
            if (userData.MsgType === 'image') {
                console.log(111);
                //将用户发送的图片,返回回去
                options.mediaId = userData.MediaId;
                options.type = 'image';
            }
            if (userData.MsgType === 'voice') {
                console.log(111);
                //将用户发送的图片,返回回去
                options.mediaId = userData.MediaId;
                options.type = 'voice';
            }

            const replyMessage = template(options);
            console.log(replyMessage);
            //返回响应
            response.send(replyMessage);
        } else {
            response.end('error');
        }

    }
};
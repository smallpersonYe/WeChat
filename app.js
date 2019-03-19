const express = require("express");
const sha1 = require('sha1');
const {parseString} = require('xml2js');
const app = express();

app.use(async (request,response) => {
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
        const xmlData = await new Promise((resolve, reject) => {
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
        let jsData = null;

        parseString(xmlData, {trim: true}, (err, result) => {
            if (!err) {
                jsData = result;
            } else {
                jsData = {};
            }
        });

        //格式化jsData
        const {xml} = jsData;
        let userData = {};
        for (let key in xml) {
            //获取到属性值
            const value = xml[key];
            //去掉数组
            userData[key] = value[0];
        }
        console.log(userData.Content);

        let content = '你说啥玩意呢,赶紧滚';
        if (userData.Content === '在吗') {
            content = '不在,没工夫搭理你';
        }else if (userData.Content.indexOf('滚') !== -1) {
            content = '你说谁呢? \n 王八犊子';
        }
        let replyMessage = `<xml>
      <ToUserName><![CDATA[${userData.FromUserName}]]></ToUserName>
      <FromUserName><![CDATA[${userData.ToUserName}]]></FromUserName>
      <CreateTime>${Date.now()}</CreateTime>
      <MsgType><![CDATA[text]]></MsgType>
      <Content><![CDATA[${content}]]></Content>
        </xml>`;

        //返回响应
        response.send(replyMessage);
    } else {
        response.end('error');
    }

});

app.listen(5000, err => {
    if(!err) {
        console.log("服务器启动成功`");
    }else {
        console.log(err);
    }
});
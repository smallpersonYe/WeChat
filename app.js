const express = require("express");
const sha1 = require('sha1');
const app = express();

app.get("/", (request,response) => {
    //微信服务器发送过来的请求参数
    console.log(request.query);
    const {signature, echostr, timestamp, nonce} = request.query;
    const token = 'smallpersonYe161005';
    //将token,timestamp, nonce三个参数进行排序
    const sortedArr = [token, timestamp, nonce].sort();
    console.log(sortedArr);
    //将三个参数字符串拼接成一个字符串进行sha1加密
    const sha1str = sha1(sortedArr.join(''));
    console.log(sha1str);

    //开发者获得加密后的字符串可与signature对比, 标识该请求来源于微信   gh_7705b52cbef9
    if (sha1str === signature) {
        response.end(echostr);
    } else {
        response.end('error');
    }

});

app.listen(3000, err => {
    if(!err) {
        console.log("服务器启动成功`");
    }else {
        console.log(err);
    }
});
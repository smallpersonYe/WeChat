/*
*   定义获取access_token的模块
*       1. 是什么?
*           是公众号的全局唯一接口调用凭据,公众号调用各接口时都需使用access_token
*       2. 特点?
*           有效期2小时 (2小时必须更新1次, 重复获取将导致上次获取的access_token.)
*       3.请求地址;
*           https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
*       4.请求方式 GET
*       5. 设计
*           - 第一次: 发送请求, 获取access_token, 保存起来, 设置过期时间
*           - 第二次: 读取本地保存access_token, 判断有没有过期
*               - 没有过期, 直接使用
*               - 过期了, 重新发送请求, 获取access_token, 保存起来, 设置过期时间
*       6. 整理
*           一上来读取本地保存access_token,
*               有: 判断有没有过期
*                   没有过期, 直接使用
*                   过期了,重新发送请求, 获取access_token 保存起来, 设置过期时间
*               没有: 发送请求, 获取access_token, 保存起来, 设置过期时间
*
* */
const rp = require('request-promise-native');
const { writeFile, readFile } = require('fs');
//发送请求, 获取access_token, 保存起来, 设置过期时间
async function getAccessToken() {
    const appId = 'wx1fe25fa360b6aeca';
    const appSecret = '8aa114e077447687a3306f1160a5ac32';
    //定义请求
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`;

    const result = await rp({method: 'GET', url, json: true});

    result.expires_in = Date.now() + 7200000 - 300000;
    console.log(result);

    writeFile('./accessToken.txt', JSON.stringify(result), (err) => {
        if (!err) console.log('文件保存成功');
        else console.log(err);
    });
    //返回获取好的access_token
    return result;
}
//得到最终有效的access_token
module.exports = function fetchAccessToken() {
    return new Promise((resolve, reject) => {
        readFile('./accessToken.txt',(err, data) => {
            if (!err) {
                resolve(JSON.parse(data.toString()));
            }else {
                reject(err);
            }
        })
    })
        .then(res => {
            if (res.expires_in < Date.now()) {
                return getAccessToken();
            } else {
                console.log(res);
                return res;
            }
        })
        .catch(err => {
            return getAccessToken();
        });

};
// (async () => {
//     let result =await getAccessToken()
// })()
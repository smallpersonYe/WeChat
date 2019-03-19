const express = require("express");
const sha1 = require('sha1');
const app = express();

app.get("/", (request,response) => {
    console.log(request.query);
});

app.listen(3000, err => {
    if(!err) {
        console.log("服务器启动成功`");
    }else {
        console.log(err);
    }
});
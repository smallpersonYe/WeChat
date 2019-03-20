

module.exports = (userData) => {
    let options = {
        toUserName: userData.FromUserName,
        fromUserName: userData.ToUserName,
        createTime: Date.now(),
        type: 'text',

    };
    if (userData.MsgType === 'text') {
        if (userData.Content === '在吗') {
            options.content = '不在,没工夫搭理你';
        }else if (userData.Content && userData.Content.indexOf('滚') !== -1) {
            options.content = '你说谁呢? \n 王八犊子';
        } else {
            options.content = '你说啥玩意呢,赶紧滚';
        }
    } else if (userData.MsgType === 'image') {
        //将用户发送的图片,返回回去
        options.mediaId = userData.MediaId;

    } else if (userData.MsgType === 'voice') {
        options.content = userData.Recognition;
    } else if (userData.MsgType === 'location') {
        options.content = `地理位置维度: ${userData.Location_X}
                         \n地理位置经度: ${userData.Location_Y}
                         \n地图缩放大小: ${userData.Scale}
                         \n地理位置信息: ${userData.Label}`
    } else if (userData.MsgType === 'event') {
        if (userData.Event === 'subscribe') {
            options.content = '来了老弟';
            if (userData.EventKey) {
                options.content = '欢迎扫描二维码,关注公众号'
            }
        } else if (userData.Event === 'unsubscribe') {
            options.content = '取关';
        } else if (userData.Event === 'CLICK') {
            options.content = '用户点击了菜单'
        }
    }


    return options;
};
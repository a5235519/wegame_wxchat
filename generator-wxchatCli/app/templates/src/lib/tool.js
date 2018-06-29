const getType = (constiate) => {
    if (typeof constiate === 'object') {
        if (constiate === null) return 'null';
        return isNaN(constiate.length) ? 'object' : 'array';
    }
    return typeof constiate;
};
const quickSort = (arr, proto) => {
    if (arr.length <= 1) return arr;
    const pivot = arr.splice(Math.floor(arr.length / 2), 1)[0];
    const left = [];
    const right = [];
    arr.forEach((i) => {
        if (i < pivot || i[proto] < pivot[proto]) left.push(i);
        else right.push(i);
    });
    return quickSort(left, proto).concat([pivot], quickSort(right, proto));
};
const getRandom = (min, max, length) => {
    const random = (Math.random() * ((max - min) + 1)) + min;
    if (!length) return Math.floor(random);
    return (random).toFixed(length);
};
const stamp2date = (stamp, nowStamp) => {
    if (stamp) {
        const date1 = new Date(stamp); // 目标日期
        const date2 = new Date(nowStamp || Date.now()); // 参考日期
        const distance = date1.getDate() - date2.getDate();
        switch (distance) {
            case 1: return '明天';
            case 0: return '今天';
            case -1: return '昨天';
            default: return `${date1.getMonth() + 1}月${date1.getDate()}日`;
        }
    }
    return '';
};
const launchGame = (game) => {
    const longPress = () => {
        wx.previewImage({
            urls: [game.QRCode],
            success: () => { global.isClick = false; },
        });
    };
    const direct = () => {
        return wx.navigateToMiniProgram({
            appId: game.appid,
            success: () => { global.isClick = false; },
            fail: longPress,
        });
    };
    if (game.launchMode === 1) direct();
    else if (game.launchMode === 2) longPress();
};
const formatDate = (stamp) => {
    const date = new Date(stamp);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? `0${m}` : m;
    let d = date.getDate();
    d = d < 10 ? `0${d}` : d;
    let h = date.getHours();
    h = h < 10 ? `0${h}` : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? `0${minute}` : minute;
    second = second < 10 ? `0${second}` : second;
    return `${y}-${m}-${d} ${h}:${minute}:${second}`;
};

const getOSInfo = (info) => {
    let system = '';
    let version = '';
    if (info.search('Android') >= 0) {
        system = 'Android';
        version = info.replace('Android ', '');
    } else if (info.search('iOS') >= 0) {
        system = 'iOS';
        version = info.replace('iOS ', '');
    }
    return { system, version };
};

const hint = (url, cb) => {
    wx.showModal({
        title: '温馨提示',
        content: '您的网络貌似有问题，请刷新试试哦~',
        showCancel: true,
        cancelText: '退出',
        success: (res) => {
            if (res.cancel) {
                wx.navigateBack({ delta: 1 });
            } else if (res.confirm) {
                wx.reLaunch({
                    url,
                    success: cb,
                });
            }
        },
    });
};

export default { quickSort, getType, getRandom, stamp2date, launchGame, formatDate, getOSInfo, hint };

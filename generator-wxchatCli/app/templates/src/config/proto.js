const type = {
    type: 'string',
};

const game = {
    appid: 'string', // 微信appId
    name: 'string', // 游戏名
    slogan: 'string', // 一句话简介
    icon: 'string', // 游戏logo
    img: 'string', // 游戏详情图
    types: 'array', // 类型
    heat: 'number', // 热度
    playerCount: 'number',  // 在玩人数
    weight: 'number', // 游戏权重，越高排行越靠前
    QRCode: 'string', // 小游戏二维码
    launchMode: 'number', // 启动方式 1: 点击启动，需挂在同一公众号 2: 长按二维码启动
    launchPath: 'string', // 点击启动可跳转到指定路由
    launchParams: 'string', // 点击启动参数
    // desc: 'string', // 长段描述
    // comment: 'string', // 点评
    // tags: 'array', // 标签
    // rate: 'number', // 评分 1 - 5
    // developer: 'string', // 开发商
    // putawayTime: 'string', // 上架时间
    // unshelveTime: 'string', // 下架时间
};

const rank = {
    name: 'string', // 榜单名
    list: 'array', // 游戏
};

const album = {
    id: 'number', // 合辑id
    name: 'string', // 合辑名
    icon: 'string', // 合辑图标
    img: 'string', // 合辑详情图
    desc: 'string', // 长段描述
    list: 'array', // 合辑内游戏
    // comment: 'string', // 合辑点评
};

const selection = {
    date: 'string', // 上架日期
    game: 'object', // 游戏
    album: 'object', // 合辑
};

export default { type, game, rank, album, selection };

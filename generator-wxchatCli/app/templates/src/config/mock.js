import Mock from 'mockjs';

const getTypes = () => {
    return ['休闲', '益智', '体育', '棋牌'];
};

const getGame = () => {
    return Mock.mock({
        'appid|': Mock.mock('@word(15)'),
        'name|': Mock.mock('@ctitle(4, 6)'),
        'slogan|': Mock.mock('@ctitle(8, 14)'),
        'icon|': Mock.Random.image(),
        'img|': Mock.Random.image(),
        'types|': () => {
            const types = getTypes();
            return [types[Mock.mock('@integer(0, 1)')], types[Mock.mock('@integer(2, 3)')]];
        },
        'heat|': Mock.mock('@integer(1000, 2000)'),
        'playerCount|': Mock.mock('@integer(1000, 2000)'),
        'weight|': Mock.mock('@integer(0, 100)'),
        'QRCode|': 'http://mwebtest.minigame.qq.com/yorickili/zhaocha.png',
        'launchMode|': Mock.mock('@integer(1, 2)'),
        'launchPath|': Mock.mock('@word(5)'),
        'launchParams|': Mock.mock('@word(10)'),
    });
};

const getGames = () => {
    const length = Mock.mock('@integer(10, 20)');
    const list = [];
    for (let i = 0; i < length; i += 1) {
        list.push(getGame());
    }
    return list;
};

const getSelections = () => {
    const getDate = () => {
        return Date.parse(Mock.mock('@datetime()')) / 1000;
    };
    const getAlbum = () => {
        return Mock.mock({
            'id|': Mock.mock('@integer(1000, 2000)'),
            'name|': Mock.mock('@ctitle(6, 10)'),
            'icon|': Mock.Random.image(),
            'img|': Mock.Random.image(),
            'desc|': Mock.mock('@ctitle(20, 30)'),
            'list|': () => {
                const length = Mock.mock('@integer(6, 10)');
                const list = [];
                for (let i = 0; i < length; i += 1) {
                    list.push(getGame());
                }
                return list;
            },
        });
    };
    const getSelection = () => {
        const mark = Mock.mock('@boolean()');
        return Mock.mock({
            'date|': getDate,
            'game|': mark ? getGame : null,
            'album|': mark ? null : getAlbum,
        });
    };
    const length = 3;
    const selections = [];
    for (let i = 0; i < length; i += 1) {
        selections.push(Mock.mock({
            'date|': getDate,
            'list|': () => {
                const len = Mock.mock('@integer(1, 3)');
                const list = [];
                for (let m = 0; m < len; m += 1) {
                    list.push(getSelection());
                }
                return list;
            },
        }));
    }
    return selections;
};

const getRank = () => {
    return Mock.mock({
        'name|': Mock.mock('@ctitle(2)'),
        'list|': getGames,
    });
};

export default {
    getTypes,
    getSelections,
    getRank,
    getGames,
};

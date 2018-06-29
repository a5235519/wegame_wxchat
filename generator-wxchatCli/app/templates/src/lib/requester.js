import { ENV } from '@/config';
import tool from './tool';

let serverTime = 0;
const baseUrl = (() => {
    switch (ENV) {
        case 'test': return 'https://test.go.minigame.qq.com';
        case 'pre': return 'https://pre.go.minigame.qq.com';
        case 'prod': return 'https://prod.go.minigame.qq.com';
        default: return '';
    }
})();

const request = (url, data) => {
    if (url === '/mpgather/mgetfeatured') wx.showLoading({ title: '' });
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + url,
            data,
            method: 'POST',
            success: (res) => {
                wx.hideLoading();
                if (res.data.result === 0) {
                    if (res.data.timestamp) serverTime = res.data.timestamp * 1000;
                    resolve(res.data.data || res.data);
                } else reject(res.data);
            },
            fail: (e) => { reject(e); },
        });
    });
};

const login = (code) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { session, login_time } = await request('/mplogin/login', { code, AppId: 'wxc2cd6f55732dc1f2' });
            resolve({ session, loginTime: login_time });
        } catch (e) {
            reject(e);
        }
    });
};

const getTypes = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await request('/mpgather/mgetgtype');
            const types = [];
            res.forEach((item) => {
                types.push({
                    sign: item.CategorySign,
                    name: item.CategoryName,
                });
            });
            resolve(types);
        } catch (e) {
            reject(e);
        }
    });
};

const getGames = (type, s, l) => {
    return new Promise(async (resolve, reject) => {
        const url = (() => {
            switch (type) {
                case 'newRank': return '/mpgather/mgetnewginfo';
                case 'hotRank': return '/mpgather/mgethotginfo';
                default: return '/mpgather/mgetginfo';
            }
        })();
        const data = (() => {
            switch (typeof type) {
                case 'string': return { gt: type, s, l };
                case 'object': return { appids: type };
                default: return {};
            }
        })();
        try {
            const res = await request(url, data);
            const games = [];
            res.forEach((item) => {
                games.push({
                    appid: item.AppId,
                    name: item.AppName,
                    slogan: item.AppIntroduction,
                    icon: item.AppIcon,
                    heat: item.AppHot,
                    QRCode: item.MiniProgramCode,
                    launchMode: item.LaunchType,
                });
            });
            resolve(games);
        } catch (e) {
            reject(e);
        }
    });
};

const getSelectionsGames = (selections) => {
    return new Promise(async (resolve, reject) => {
        try {
            const appids = [];
            selections.forEach((daily) => {
                daily.list.forEach((item) => {
                    if (item.game) appids.push(item.game);
                    else if (item.album) appids.push(...item.album.list);
                });
            });
            const games = await getGames(appids);
            const $selection = selections;
            selections.forEach((daily, index1) => {
                daily.list.forEach((item, index2) => {
                    if (item.game) {
                        for (let i = 0; i < games.length; i += 1) {
                            if (item.game === games[i].appid) {
                                $selection[index1].list[index2].game = games[i];
                                break;
                            }
                        }
                    } else if (item.album) {
                        item.album.list.forEach((appid, index3) => {
                            for (let i = 0; i < games.length; i += 1) {
                                if (appid === games[i].appid) {
                                    $selection[index1].list[index2].album.list[index3] = games[i];
                                    break;
                                }
                            }
                        });
                    }
                });
            });
            resolve($selection);
        } catch (e) {
            reject(e);
        }
    });
};

const getSelections = (s, l) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await request('/mpgather/mgetfeatured', { s, l });
            const selections = [];
            res.forEach((arr, index1) => {
                const list = [];
                arr.forEach((item, index2) => {
                    list.push({
                        date: item.OnlineTimestamp * 1000,
                        serverTime: item.ServerTime,
                        site: (s + index2 + 1 + (index1 > 0 ? res[index1 - 1].length : 0)) || -1,
                        cover: item.FeaturedImg,
                        game: item.FeaturedType === 1 ? item.AppId : null,
                        album: item.FeaturedType === 2 ? {
                            id: item.AppId,
                            name: item.FeaturedName,
                            icon: item.FeaturedImg,
                            img: item.FeaturedHeaderImg,
                            desc: item.FeaturedIntroduction,
                            color: item.FeaturedHeaderColor,
                            list: item.FeaturedAppId,
                        } : null,
                    });
                });
                selections.push({ list, date: tool.stamp2date(list[0].date, serverTime) });
            });
            resolve(await getSelectionsGames(selections));
        } catch (e) {
            reject(e);
        }
    });
};

export default { request, login, getTypes, getGames, getSelections };

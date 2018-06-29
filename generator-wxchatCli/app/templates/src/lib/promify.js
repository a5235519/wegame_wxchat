const promify = {
    getGlobalData() {
        return new Promise((resolve, reject) => {
            let times = 0;
            const timer = setInterval(() => {
                if (global.data) {
                    clearInterval(timer);
                    resolve(global.data);
                } else if (times >= 10) {
                    clearInterval(timer);
                    reject();
                } else {
                    times += 1;
                }
            }, 100);
        });
    },
};

['login', 'getUserInfo', 'request', 'navigateTo', 'getSystemInfo', 'getNetworkType'].forEach((api) => {
    promify[api] = (params) => {
        return new Promise((resolve, reject) => {
            wx[api](Object.assign(params || {}, {
                success: res => resolve(res),
                fail: reject,
            }));
        });
    };
});

export default promify;

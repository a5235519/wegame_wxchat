import requester from './requester';

/* eslint-disable object-property-newline */
const map = {
    dtLoginTime: -1, vQimei: -1, vAppVer: -1, PlatID: -1, vOsType: -1, osversion: -1, nettype: -1, model: -1,
    iActionId: -1, iSceneLevel1: -1, iSceneLevel2: -1, iSceneLevel3: -1, iResourceId1: -1,
    iResourceId2: -1, iResourceId3: -1, iResourceId4: -1, iResourceId5: -1, iRet: -1,
    vV1: -1, vV2: -1, vV3: -1, vV4: -1, vV5: -1, vV6: -1, vV7: -1, vV8: -1, vV9: -1, vV10: -1,
};

const test = {
    dtLoginTime: -1, vQimei: -1, vAppVer: -1, PlatID: -1, vOsType: -1, osversion: -1, nettype: -1, model: -1,
    iActionId: -1, iSceneLevel1: -1, iSceneLevel2: -1, iSceneLevel3: -1, iResourceId1: -1,
    iResourceId2: -1, iResourceId3: -1, iResourceId4: -1, iResourceId5: -1, iRet: -1,
    vV1: -1, vV2: -1, vV3: -1, vV4: -1, vV5: -1, vV6: -1, vV7: -1, vV8: -1, vV9: -1, vV10: -1,
};

Object.defineProperties(test, (() => {
    const obj = {};
    Object.keys(test).forEach((key) => {
        obj[key] = {
            get() { return test[key]; },
            set(value) { test[key] = value; },
        };
    });
    return obj;
})());

const setMap = (options) => {
    Object.keys(options).forEach((key) => {
        map[key] = options[key];
    });
};

const getMap = () => { return map; };

const report = (data) => {
    const $map = getMap();
    const content = (() => {
        Object.keys(data).forEach((key) => { $map[key] = data[key]; });
        console.log($map);
        const arr = [];
        Object.keys($map).forEach((key) => { arr.push($map[key]); });
        return arr.join('|');
    })();
    console.log(content);
    return new Promise(async (resolve, reject) => {
        try {
            const result = await requester.request('/mpreport/reporttlog', {
                data: content,
                session: global.session,
            });
            resolve(result);
        } catch (e) {
            reject(e);
        }
    });
};

export default { setMap, report };

import Vue from 'vue';
import App from '@/App';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
    config: {
        pages: ['pages/index/index'],
        window: {
            backgroundColor: '#F5F5F5',
            backgroundTextStyle: 'light',
            navigationBarBackgroundColor: '#ffffff',
            navigationBarTitleText: `<%= projectName %>`,
            navigationBarTextStyle: 'black',
        },
    },
};

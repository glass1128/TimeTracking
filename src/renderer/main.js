import Vue from 'vue';
import App from './app';
import './plugins';
import VueI18n from 'vue-i18n';
import router from './router';
import store from './store';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import '@mdi/font/css/materialdesignicons.css';
import VueSplit from 'vue-split-panel';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueSplit);
export default new Vuetify({
  iconfont: 'mdi'
});

new Vue({
  components: { App },
  router,
  store,
  vuetify: new Vuetify(),
  template: '<app/>',
  i18n: new VueI18n({
    locale: navigator.language,
    fallbackLocale: 'en'
  })
}).$mount('#app');

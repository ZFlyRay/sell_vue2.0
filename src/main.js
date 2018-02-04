import 'babel-polyfill';
import fastClick from 'fastclick';
import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App';
import router from './router/index';

import 'common/sass/index.sass';

fastClick.attach(document.body);

Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

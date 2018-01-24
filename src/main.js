import Vue from 'vue';
import App from './App';
import router from './router/index';

import 'common/sass/index.sass';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

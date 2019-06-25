// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Muse from './Muse.config'
import Toast from 'muse-ui-toast'
import Helpers from 'muse-ui/lib/Helpers'
import axios from 'axios'
import vueAxios from 'vue-axios'
import VueLazyload from 'vue-lazyload'

axios.defaults.withCredentials = true
Vue.use(vueAxios, axios)
Vue.use(Muse)
Vue.use(Toast)
Vue.use(Helpers)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: './static/img/lazy.png',
  attempt: 1
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

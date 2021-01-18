import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import routes from './routes'
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css';
import stores from 'vue-stores'
import UUID from 'vue-uuid'

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter)
Vue.use(stores)
Vue.use(UUID)

const router = new VueRouter({
  routes,
  mode: "history"
});

new Vue({
  el: '#app',
  router,
  data: {
    state: {
      logged: false,
      currentUser: {},
    }
  },
  render: h => h(App)
})

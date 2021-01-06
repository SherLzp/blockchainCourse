import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import global from './common/Common'
// import { store } from './store/'

Vue.config.productionTip = false
new Vue({
  router,
  vuetify,
  global,
  // store,
  render: h => h(App)
}).$mount('#app')

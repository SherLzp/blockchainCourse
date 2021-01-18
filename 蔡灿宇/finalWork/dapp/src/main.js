import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import Global from './Global.vue'

Vue.config.productionTip = false

Vue.prototype.GLOBAL = Global;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

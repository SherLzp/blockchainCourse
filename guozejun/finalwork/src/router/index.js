import Vue from 'vue'
import VueRouter from 'vue-router'
// import App from '../App'
// import Home from '../views/Home.vue'
import InitiateCrowdfunding from '../components/InitiateCrowdfunding'
import JoinCrowdfunding from '../components/JoinCrowdfunding'
import MyCrowdfunding from '../components/MyCrowdfunding'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: InitiateCrowdfunding
  },
  {
    path: "/join",
    component: JoinCrowdfunding
  },
  {
    path: "/my",
    component: MyCrowdfunding
  }
]

const router = new VueRouter({
  routes
})

export default router

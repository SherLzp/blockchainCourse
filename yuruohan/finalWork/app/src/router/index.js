import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../components/home.vue')
  },
  {
    path: '/all_fund',
    name: 'all_fund',
    component: () => import('../components/all_fund.vue')
  },
  {
    path: '/my_fund',
    name: 'my_fund',
    component: () => import('../components/my_fund.vue')
  },
  {
    path: '/my_invest',
    name: 'my_invest',
    component: () => import('../components/my_invest.vue')
  },
  {
    path: '/new_fund',
    name: 'new_fund',
    component: () => import('../components/new_fund.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

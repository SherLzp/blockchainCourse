import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Item from '../views/Item.vue'
import Create from '../views/Create.vue'
import Minec from '../views/Mine_create.vue'
import Minei from '../views/Mine_invest.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/item',
    name: 'Item',
    component: Item
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/mine_create',
    name: 'Mine_Create',
    component: Minec
  },
  {
    path: '/mine_invest',
    name: 'Mine_Invest',
    component: Minei
  }
]

const router = new VueRouter({
  routes
})

export default router

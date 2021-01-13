import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'projectspage',
    component: () => import('../views/ProjectsPage.vue')
  },
  {
    path: '/myproject',
    name: 'myproject',
    component: () => import('../views/MyProject.vue')
  },
  {
    path: '/accountpage',
    name: 'accountpage',
    component: () => import('../views/AccountPage.vue')
  },
  {
    path: '/myinvestment',
    name: 'myinvestment',
    component: () => import('../views/MyInvestment.vue')
  },
  {
    path: '/funding/:id',
    name: 'funding',
    component: () => import('../views/InvestPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

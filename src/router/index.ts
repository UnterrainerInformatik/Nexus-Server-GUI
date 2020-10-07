import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/app/landingpage'
  },
  {
    path: '/app/main',
    alias: '/',
    name: 'main',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/app/landingpage',
    alias: '/',
    name: 'landingpage',
    component: () => import('../views/LandingPage.vue')
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/Logout.vue')
  },
  {
    path: '/settings/preferences',
    name: 'preferences',
    component: () => import('../views/Preferences.vue')
  },
  {
    path: '/settings/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/*',
    component: () => import('../views/page404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/User'
import Rights from '../components/power/Rights'
import Roles from '../components/power/Roles'
import Categories from '../components/goods/Categories'
import Goods from '../components/goods/Goods'
import Params from '../components/goods/Params'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/Login',
    name: Login,
    component: () => import('../components/Login')
  },
  {
    path: '/Home',
    name: Home,
    redirect: '/Welcome',
    component: () => import('../components/Home'),
    children: [
      {
        path: '/Welcome',
        name: Welcome,
        component: () => import('../components/Welcome')
      },
      {
        path: '/Users',
        name: Users,
        component: () => import('../components/user/User')
      },
      {
        path: '/Rights',
        name: Rights,
        component: () => import('../components/power/Rights')
      },
      {
        path: '/Roles',
        name: Roles,
        component: () => import('../components/power/Roles')
      },
      {
        path: '/Categories',
        name: Categories,
        component: () => import('../components/goods/Categories')
      },
      {
        path: '/Goods',
        name: Goods,
        component: () => import('../components/goods/Goods')
      },
      {
        path: '/Params',
        name: Params,
        component: () => import('../components/goods/Params')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokens = window.sessionStorage.getItem('token')
  if (!tokens) return next('/login')
  next()
})

export default router

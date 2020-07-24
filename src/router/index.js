import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

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
    component: () => import('../components/Home')
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

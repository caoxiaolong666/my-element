import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import Users from '../components/user/User'

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

import Vue from 'vue'
import Router from 'vue-router'
import Start from '@/components/Start/Start'
import MyMusic from '@/components/MyMusic/MyMusic'
import Find from '@/components/Find/Find'
import Dynamic from '@/components/Dynamic/Dynamic'
import Home from '@/components/Home/Home'
import Login from '@/components/Login/Login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/start'
    },
    {
      path: '/start',
      name: 'Start',
      component: Start
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          name: 'MyMusic',
          component: MyMusic
        },
        {
          path: 'find',
          name: 'Find',
          component: Find
        },
        {
          path: 'dynamic',
          name: 'Dynamic',
          component: Dynamic
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})

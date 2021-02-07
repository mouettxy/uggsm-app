import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import { authModule } from '@/store'
import { includes } from 'lodash'

Vue.use(Router)

const RouterLayout = createRouterLayout((layout) => {
  return import('@/layouts/' + layout + '.vue')
})

export const router = new Router({
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes,
    },
  ],
  mode: 'history',
})

const guestAllowed = ['login', 'settingsNewUser', 'settingsNewOffice']

router.beforeEach((to, from, next) => {
  if (to.meta.resource && Vue.prototype.$ability && Vue.prototype.$ability.can('access', to.meta.resource)) {
    next({ name: 'index' })
  }

  const isLoggedIn = authModule.isLoggedIn

  if (!isLoggedIn && includes(guestAllowed, to.name)) {
    next()
    return
  } else if (!isLoggedIn && !includes(guestAllowed, to.name)) {
    next({ name: 'login' })
    return
  }

  if (isLoggedIn && to.name === 'login') {
    next({ name: 'orders' })
    return
  }

  next()
})

export default router

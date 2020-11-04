import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import { authModule } from '@/store'

import PageOrders from '@/pages/orders/index.vue'
import OrderModal from '@/pages/orders/__id__.vue'
import { includes } from 'lodash'

Vue.use(Router)

const RouterLayout = createRouterLayout((layout) => {
  return import('@/layouts/' + layout + '.vue')
})

routes.push({ name: 'orderModal', path: 'orders/:id?', components: { default: PageOrders, modal: OrderModal } })

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

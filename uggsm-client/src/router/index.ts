import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import { authModule } from '@/store'

import PageOrders from '@/pages/orders/index.vue'
import OrderModal from '@/pages/orders/__id__.vue'

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

router.beforeEach((to, from, next) => {
  const isLoggedIn = authModule.isLoggedIn
  if (!isLoggedIn && to.name !== 'login') {
    Vue.prototype.$notification.error('Авторизуйтесь прежде чем вам станут доступны основные функции приложения.')
    if (to.name === 'register') {
      next()
    } else {
      next({ name: 'login' })
    }
  } else if (isLoggedIn && to.name === 'login') {
    next({ name: 'orders' })
  } else {
    next()
  }
})

export default router

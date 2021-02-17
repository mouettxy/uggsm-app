import Vue from 'vue'

function requireComponents(req: any) {
  for (const key of req.keys()) {
    const name = /[\w,\s-]+\.(vue)$/g.exec(key)

    console.log(name)

    if (name) {
      Vue.component(name[0].slice(0, -4), req(key).default)
    }
  }
}

let req1 = require.context('../components', true, /\.(vue)$/i)
requireComponents(req1)
if (module.hot) {
  module.hot.accept(req1.id, () => {
    req1 = require.context('../components', true, /\.(vue)$/i)

    requireComponents(req1)
  })
}

let req2 = require.context('../templates', true, /\.(vue)$/i)
if (module.hot) {
  module.hot.accept(req2.id, () => {
    req2 = require.context('../templates', true, /\.(vue)$/i)
    requireComponents(req2)
  })
}
requireComponents(req2)

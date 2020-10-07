import Vue from 'vue'
import { Model } from 'vue-property-decorator'

function requireComponents(req: any) {
  for (const key of req.keys()) {
    const name = /(\w*)\.(vue)$/g.exec(key)

    if (name) {
      Vue.component(name[1], req(key).default)
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

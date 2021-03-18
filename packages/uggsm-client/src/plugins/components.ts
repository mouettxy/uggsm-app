import { isNull, startsWith } from 'lodash'
import { start } from 'repl'
import Vue from 'vue'

function requireComponents(req: any) {
  for (const key of req.keys()) {
    const name = /[\w,\s-]+\.(vue)$/g.exec(key)

    if (!isNull(name)) {
      let componentName = name[0]

      if (startsWith(key, './base') || startsWith(key, './role')) {
        componentName = 'ug-' + componentName
      }

      if (name) {
        Vue.component(componentName.slice(0, -4), req(key).default)
      }
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

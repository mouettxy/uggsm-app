import Vue from 'vue'
// @ts-ignore
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
}

Vue.use(VueHtmlToPaper, options)

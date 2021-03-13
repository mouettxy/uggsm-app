import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Responsive extends Vue {
  get isMobile() {
    return this.$vuetify.breakpoint.smAndDown
  }

  get screenWidth() {
    return this.$vuetify.breakpoint.width
  }
}

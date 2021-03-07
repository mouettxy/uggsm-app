import { TimelineLite } from 'gsap'

export default {
  data: function () {
    return {
      mobileMenuTimeline: null,
      isMobileMenuVisible: false,
    }
  },
  methods: {
    showMenu(menuContentElement) {
      if (this.mobileMenuTimeline && !this.isMobileMenuVisible) {
        const isReversed = this.mobileMenuTimeline.reversed()
        document.documentElement.classList.add('overflow-y-hidden')

        this.isMobileMenuVisible = true

        if (isReversed) {
          this.mobileMenuTimeline.play()

          return
        }

        this.mobileMenuTimeline
          .set(menuContentElement, {
            display: 'block',
            position: 'fixed',
            height: '100%',
            top: 0,
            left: 0,
            width: 0,
            background: '#f1f1f1',
          })
          .to(menuContentElement, {
            duration: 0.5,
            width: '100%',
          })
      }
    },
    hideMenu() {
      if (this.mobileMenuTimeline) {
        document.documentElement.classList.remove('overflow-y-hidden')
        this.mobileMenuTimeline.reverse()

        this.isMobileMenuVisible = false
      }
    },
  },
  mounted: function () {
    this.mobileMenuTimeline = new TimelineLite()
  },
}

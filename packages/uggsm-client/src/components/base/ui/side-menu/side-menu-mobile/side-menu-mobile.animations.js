import { TimelineLite } from 'gsap'
import { Expo } from 'gsap'
import { findElements } from '@/helpers/DOMHelpers'

export default {
  data: function () {
    return {
      mobileMenuTimeline: null,
      isMobileMenuVisible: false,
      userPanelTimeline: null,
      isUserPanelVisible: false,
    }
  },
  methods: {
    showUserPanel() {
      const timeline = this.userPanelTimeline
      const visible = this.isUserPanelVisible
      const { username, title, logout, menu } = findElements(
        {
          username: '.ug-side-menu__username',
          title: '.ug-side-menu__title',
          logout: '.ug-side-menu__action-logout',
          menu: '.ug-side-menu__action-menu',
        },
        '.ug-side-menu__header'
      )

      if (timeline) {
        if (visible) {
          this.hideUserPanel()
          return
        }
        const isReversed = timeline.reversed()

        this.isUserPanelVisible = true

        if (isReversed) {
          timeline.play()
          return
        }

        timeline
          .set(logout, {
            opacity: 0,
          })
          .set(username, {
            transform: 'translateY(48px)',
            opacity: 0,
          })
          .to(title, {
            duration: 0.2,
            transform: 'translateY(-32px)',
            opacity: 0,
            display: 'none',
          })
          .to(
            menu,
            {
              duration: 0.1,
              opacity: 0,
              display: 'none',
            },
            '-=0.1'
          )
          .to(
            logout,
            {
              duration: 0.1,
              display: 'block',
              opacity: 1,
            },
            '-=0.01'
          )
          .to(
            username,
            {
              duration: 0.2,
              display: 'block',
              opacity: 1,
              transform: 'translateY(0%)',
            },
            '-=0.1'
          )
      }
    },

    hideUserPanel() {
      const timeline = this.userPanelTimeline

      if (timeline) {
        timeline.reverse()

        this.isUserPanelVisible = false
      }
    },

    showMenu() {
      const timeline = this.mobileMenuTimeline
      const visible = this.isMobileMenuVisible
      const { content } = findElements(
        {
          content: '.ug-side-menu-content',
        },
        '.ug-side-menu__container'
      )

      if (timeline) {
        if (visible) {
          this.hideMenu()
          return
        }

        document.documentElement.classList.add('overflow-y-hidden')

        const isReversed = timeline.reversed()

        this.isMobileMenuVisible = true

        if (isReversed) {
          timeline.play()
          return
        }

        timeline
          .set(content, {
            transform: 'translateY(-100vh)',
          })
          .to(content, {
            duration: 0.3,
            display: 'block',
            ease: Expo.easeOut,
            transform: 'translateY(0)',
          })
      }
    },

    hideMenu() {
      const timeline = this.mobileMenuTimeline

      if (timeline) {
        document.documentElement.classList.remove('overflow-y-hidden')

        timeline.reverse()

        this.isMobileMenuVisible = false
      }
    },
  },
  mounted: function () {
    this.mobileMenuTimeline = new TimelineLite()
    this.userPanelTimeline = new TimelineLite()
  },
}

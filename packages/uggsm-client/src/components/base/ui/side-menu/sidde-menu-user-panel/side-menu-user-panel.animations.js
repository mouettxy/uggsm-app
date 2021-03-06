import { TimelineLite } from 'gsap'

export default {
  data: function () {
    return {
      userPanelTimeline: null,
      isUserPanelVisible: false,
    }
  },
  methods: {
    userPanelSlideIn(userPanelElement) {
      const userPanelElementContent = userPanelElement.querySelector('.ug-side-menu-user-panel__content-text')
      const userPanelElementContentText = userPanelElementContent.querySelector('span')
      const userPanelElementContentButton = userPanelElementContent.querySelector(
        '.ug-side-menu-user-panel__content-button'
      )

      if (this.userPanelTimeline) {
        const isReversed = this.userPanelTimeline.reversed()

        if (this.isUserPanelVisible) {
          this.userPanelSlideOut()

          return
        }

        this.isUserPanelVisible = true

        if (isReversed) {
          this.userPanelTimeline.play()

          return
        }

        this.userPanelTimeline
          .set(userPanelElement, {
            display: 'none',
            width: '40px',
            height: '40px',
            opacity: 0,
          })
          .set(userPanelElementContent, {
            visibility: 'hidden',
            display: 'inline-block',
            width: 'auto',
          })
          .set(userPanelElementContentText, {
            position: 'relative',
            left: -50,
          })
          .set(userPanelElementContentButton, {
            opacity: 0,
          })
          .to(userPanelElement, {
            duration: 0.1,
            display: 'flex',
            opacity: 1,
          })
          .to(
            userPanelElement,
            {
              duration: 0.2,
              width: 'auto',
              paddingLeft: 48,
            },
            '+=0.1'
          )
          .to(
            userPanelElementContent,
            {
              duration: 0.05,
              display: 'flex',
              visibility: 'visible',
            },
            '+=0.2'
          )
          .to(
            userPanelElementContentText,
            {
              duration: 0.2,
              left: 0,
            },
            '-=0.05'
          )
          .to(
            userPanelElementContentButton,
            {
              duration: 0.1,
              opacity: 1,
            },
            '-=0.1'
          )
      }
    },
    userPanelSlideOut() {
      if (this.userPanelTimeline) {
        this.userPanelTimeline.reverse()

        this.isUserPanelVisible = false
      }
    },
  },
  mounted: function () {
    this.userPanelTimeline = new TimelineLite()
  },
}

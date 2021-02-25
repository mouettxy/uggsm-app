import { TimelineLite, Expo, Sine } from 'gsap'

export default {
  data: function () {
    return {
      appendTimeline: null,
      hitTimeline: null,
      isHintPlayed: false,
    }
  },
  methods: {
    animateHint(hintElement) {
      if (this.hintTimeline) {
        const isReversed = this.hintTimeline.reversed()

        if (this.isHintPlayed) {
          this.deanimateHint()

          return
        }

        this.isHintPlayed = true

        if (isReversed) {
          this.hintTimeline.play()

          return
        }

        this.hintTimeline
          .set(hintElement, {
            display: 'block',
            width: '24px',
            height: '24px',
            boxShadow: '2px 5px 7px 1px rgba(0, 0, 0, 0.10)',
            border: '1px solid #ccc',
            padding: 4,
            top: 0,
            right: 0,
            borderRadius: '50%',
          })
          .to(hintElement, {
            background: '#fafafa',
            right: 28,
            borderRadius: '50%',
            duration: 0.3,
            ease: Expo.easeIn,
          })
          .to(hintElement, {
            width: 400,
            borderRadius: '4px',
            top: 0,
            right: 28,
            duration: 0.5,
            ease: Expo.easeIn,
          })
          .to(hintElement, {
            height: 'auto',
            duration: 0.15,
            ease: Sine.easeIn,
          })
      }
    },
    deanimateHint() {
      if (this.hintTimeline) {
        this.hintTimeline.reverse()

        this.isHintPlayed = false
      }
    },
    animateAppend(appendElement) {
      if (this.appendTimeline) {
        this.appendTimeline.fromTo(
          appendElement,
          {
            boxShadow: '0px 0px 10px -2px rgba(0, 0, 0, 0.10)',
            duration: 0.5,
            ease: Sine.easeIn,
          },
          {
            boxShadow: '0px 0px 17px -2px rgba(0, 0, 0, 0.50)',
            repeat: -1,
            duration: 0.5,
            yoyo: true,
            ease: Sine.easeOut,
          }
        )
      }
    },
    deanimateAppend(appendElement) {
      if (this.appendTimeline) {
        this.appendTimeline
          .fromTo(
            appendElement,
            {
              boxShadow: 'none',
            },
            {
              boxShadow: 'none',
            }
          )
          .clear()
      }
    },
  },
  mounted: function () {
    this.appendTimeline = new TimelineLite()
    this.hintTimeline = new TimelineLite()
  },
}

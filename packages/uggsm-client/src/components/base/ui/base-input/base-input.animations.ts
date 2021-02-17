import { Vue, Component } from 'vue-property-decorator'
import { TimelineLite, Expo, Sine } from 'gsap'

@Component
export default class UgBaseInputAnimations extends Vue {
  public appendTimeline: TimelineLite | null = null
  public hintTimeline: TimelineLite | null = null
  public isHintPlayed = false

  animateHint(hint: HTMLElement) {
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
        .set(hint, {
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
        .to(hint, {
          background: '#fafafa',
          right: 28,
          borderRadius: '50%',
          duration: 0.3,
          ease: Expo.easeIn,
        })
        .to(hint, {
          width: 400,
          borderRadius: '4px',
          top: 0,
          right: 28,
          duration: 0.5,
          ease: Expo.easeIn,
        })
        .to(hint, {
          height: 'auto',
          duration: 0.15,
          ease: Sine.easeIn,
        })
    }
  }

  deanimateHint() {
    if (this.hintTimeline) {
      this.hintTimeline.reverse()

      this.isHintPlayed = false
    }
  }

  animateAppend(append: HTMLElement) {
    if (this.appendTimeline) {
      this.appendTimeline.fromTo(
        append,
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
  }

  deanimateAppend(append: HTMLElement) {
    if (this.appendTimeline) {
      this.appendTimeline
        .fromTo(
          append,
          {
            boxShadow: 'none',
          },
          {
            boxShadow: 'none',
          }
        )
        .clear()
    }
  }

  mounted() {
    this.appendTimeline = new TimelineLite()
    this.hintTimeline = new TimelineLite()
  }
}

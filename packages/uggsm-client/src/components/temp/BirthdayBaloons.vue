<template lang="pug">
.birthday-baloons
  template(v-if='isShow')
    a-center-modal(v-model='popup')
      v-card
        v-card-title
          v-spacer
          v-btn(
            @click='neverShowAgain',
            icon
          )
            v-icon mdi-close
        v-card-text.pa-10.text-center
          span.rainbow.rainbow_text_animated С ДР!
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BirthdayBaloons extends Vue {
  public popup = true

  get isShow() {
    return !localStorage.getItem('fire-birthday-baloons')
  }

  neverShowAgain() {
    this.popup = false
    localStorage.setItem('fire-birthday-baloons', 'true')
    document.location.reload()
  }

  fire() {
    const density = 18 // concurrent balloon count
    const balloons = []
    const colors = ['yellow', 'green', 'blue', 'red']

    const stringElement = document.createElement('div')
    stringElement.classList.add('string')

    for (let i = 0; i < density; i++) {
      const element = document.createElement('div')
      element.classList.add('balloon')
      element.classList.add(randomColor())

      element.append(stringElement.cloneNode())
      document.body.append(element)

      setTimeout(() => {
        releaseBalloon(element)
      }, i * 400 + random(500, 1000))
    }

    function randomColor() {
      return colors[random(0, colors.length)]
    }

    function random(min: any, max: any) {
      return Math.floor(Math.random() * (max - min)) + min
    }

    function releaseBalloon(balloon: any) {
      const delay = random(100, 1000)
      const x = random(-99, -30) // random x value to fly
      const y = random(-99, -30) // random y value to fly

      const sequence = [
        {
          offset: 0,
          transform: `rotateZ(45deg) translate(0, 0)`,
        },
      ]

      // random fly direction
      if (random(0, 2) === 0) {
        // first fly up to top left

        // left distance to keep balloon in view
        balloon.style.left = `${-1 * x}vw`

        sequence.push({
          offset: x / -200,
          transform: `rotateZ(45deg) translate(${x}vw, 0)`,
        })
        sequence.push({
          offset: (x + y) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`,
        })
        sequence.push({
          offset: (-100 + y) / -200,
          transform: `rotateZ(45deg) translate(-100vw, ${y}vh)`,
        })
      } else {
        // fist fly up to right top

        sequence.push({
          offset: y / -200,
          transform: `rotateZ(45deg) translate(0, ${y}vh)`,
        })
        sequence.push({
          offset: (x + y) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, ${y}vh)`,
        })
        sequence.push({
          offset: (-100 + x) / -200,
          transform: `rotateZ(45deg) translate(${x}vw, -100vh)`,
        })
      }

      // last move is common
      sequence.push({
        offset: 1,
        transform: `rotateZ(45deg) translate(-100vw, -100vh)`,
      })

      const balloonAnimation = balloon.animate(sequence, {
        duration: 15000,
        delay: delay,
      })

      balloonAnimation.onfinish = () => {
        releaseBalloon(balloon)
      }
    }
  }

  created() {
    if (this.isShow) {
      this.fire()
    }
  }
}
</script>

<style lang="sass">
.balloon
  --balloonDimension:5vmax

  /* 15% of min(viewport width, height)
  z-index: 10000
  width: var(--balloonDimension)
  height: var(--balloonDimension)
  border-radius: 100% 100% 15% 100%
  margin: 0 0 0 25px
  transform: rotateZ(45deg)
  position: fixed
  bottom: calc(-1 * var(--balloonDimension))
  left: 0
  background-color: aqua

  &::before
    content: ""
    width: 10%
    height: 25%
    background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.1) 100%)
    position: absolute
    left: 15%
    top: 45%
    border-radius: 100%

  &::after
    content: ""
    width: 13%
    height: 5%
    background-color: inherit
    position: absolute
    left: 90%
    top: 94%
    border-radius: 22%
    transform: rotateZ(-45deg)

  .string
    position: absolute
    background-color: #990
    width: 2px
    height: calc(var(--balloonDimension) * .6)
    transform-origin: top center
    transform: rotateZ(-45deg)
    top: calc(var(--balloonDimension) - 6px)
    left: calc(var(--balloonDimension) - 8px)

.yellow
  background-color: rgba(150, 150, 0, 0.45)

.green
  background-color: rgba(0, 150, 0, 0.45)

.blue
  background-color: rgba(0, 0, 150, 0.45)

.red
  background-color: rgba(150, 0, 0, 0.45)

.rainbow
  text-align: center
  text-decoration: underline
  font-size: 60px
  font-family: 'Pacifico', cursive
  letter-spacing: 5px

.rainbow_text_animated
  background: linear-gradient(to right, #6666ff, #0099ff, #00ff00, #ff3399, #6666ff)
  -webkit-background-clip: text
  background-clip: text
  color: transparent
  animation: rainbow_animation 2s ease-in-out infinite
  background-size: 400% 100%

@keyframes rainbow_animation
  0%,100%
    background-position: 0 0

  50%
    background-position: 100% 0
</style>

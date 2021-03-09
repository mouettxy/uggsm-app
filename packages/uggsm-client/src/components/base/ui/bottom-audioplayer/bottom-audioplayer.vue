<template lang="pug">
.ug-bottom-audioplayer
  audio(
    ref='player',
    :src='audio',
    @timeupdate='onTimeUpdate',
    @play='onPlay',
    @pause='onPause',
    @ended='onEnd',
    @durationchange='onDurationChange',
    preload='metadata'
  )

  v-bottom-sheet(
    v-model='sheet',
    inset,
    content-class='ug-bottom-audioplayer__sheet'
  )
    template(v-slot:activator='{ on, attrs }')
      slot(
        name='activator',
        :on='on',
        :duration='duration',
        :attrs='attrs'
      )
    v-card(tile='')
      v-slider.mn-2(
        :value='progressBar',
        :step='0.00001',
        @mouseup='onManualTimeSeekEnd',
        @mousedown='onManualTimeSeekStart',
        @change='onManualTimeChange',
        hide-details,
        height='3'
      )
      v-row.ug-bottom-audioplayer__controls(no-gutters)
        v-col(cols='3')
          v-list-item
            v-list-item-content
              v-list-item-title {{ title }}
              v-list-item-subtitle {{ subtitle }}
        v-col.ug-bottom-audioplayer__controls__duration(cols='6')
          span.grey--text {{ Math.ceil(currentTime) }}:{{ Math.ceil(duration) }}

        v-col.ug-bottom-audioplayer__controls__audio(cols='3')
          template(v-if='duration')
            v-btn(
              @click='fastBackward',
              icon
            )
              v-icon mdi-rewind
            v-btn(
              @click='play',
              icon=''
            )
              v-fab-transition(leave-absolute)
                v-icon(v-if='isPaused') mdi-play
              v-fab-transition(leave-absolute)
                v-icon(v-if='!isPaused') mdi-pause
            v-btn(
              @click='fastForward',
              icon
            )
              v-icon mdi-fast-forward
            v-menu.ug-bottom-audioplayer__controls__audio-controls__volume(
              :close-on-content-click='false',
              top,
              offset-y,
              content-class='ug-bottom-audioplayer__controls__audio__volume-content'
            )
              template(#activator='{on, attrs}')
                v-btn(
                  v-on='on',
                  v-bind='attrs',
                  icon
                )
                  v-icon mdi-volume-high
              v-card
                v-slider.elevation-1(
                  v-model='volume',
                  :step='0.01',
                  :min='0',
                  :max='1',
                  @change='changeVolume',
                  vertical
                )
</template>

<script>
export default {
  name: 'ug-bottom-audioplayer',

  props: {
    audio: {
      required: true,
      type: [String],
    },

    title: {
      required: false,
      type: [String],
      default: '',
    },

    subtitle: {
      required: false,
      type: [String],
      default: '',
    },
  },

  data: function () {
    return {
      sheet: false,
      isPaused: true,
      isEnded: false,
      duration: 0,
      currentTime: 0,
      progressBar: 0,
      volume: 0.5,
    }
  },

  watch: {
    sheet: function (value) {
      if (!value) {
        this.stop()
      } else {
        if (this.duration > 0) {
          this.play()
        }
      }
    },
  },

  beforeDestroy: function () {
    this.stop()
  },

  methods: {
    changeVolume() {
      const { player } = this.$refs

      if (this.sheet) {
        player.volume = this.volume
      }
    },

    onManualTimeChange(time) {
      const { player } = this.$refs

      if (this.sheet) {
        player.currentTime = (this.duration * time) / 100
      }
    },

    onManualTimeSeekStart() {
      const { player } = this.$refs

      player.pause()
    },

    onManualTimeSeekEnd() {
      const { player } = this.$refs

      if (this.sheet) {
        player.play()
      }
    },

    play() {
      const { player } = this.$refs

      if (this.sheet && this.currentTime === this.duration) {
        this.rewind()
        return
      }
      if (this.sheet && this.isPaused) {
        player.play()
      } else if (this.sheet) {
        player.pause()
      }
    },

    fastBackward() {
      const { player } = this.$refs

      player.pause()

      const calculated = this.currentTime - 5

      if (calculated < 0) {
        player.currentTime = 0
      } else {
        player.currentTime = calculated
      }

      player.play()
    },

    fastForward() {
      const { player } = this.$refs

      player.pause()
      const calculated = this.currentTime + 5.0

      if (calculated > this.duration) {
        player.currentTime = this.duration
      } else {
        player.currentTime = calculated
        player.play()
      }
    },

    rewind() {
      const { player } = this.$refs

      if (this.sheet) {
        player.currentTime = 0
        this.play()
      }
    },

    onPlay() {
      this.isPaused = false
    },

    onPause() {
      this.isPaused = true
    },

    onEnd() {
      this.isPaused = true
    },

    onDurationChange() {
      const { player } = this.$refs

      this.duration = player.duration
    },

    onTimeUpdate() {
      const { player } = this.$refs

      this.currentTime = player.currentTime

      this.progressBar = (this.currentTime / this.duration) * 100
    },

    stop() {
      const { player } = this.$refs

      player.pause()
      this.currentTime = 0
    },
  },
}
</script>

<style lang="sass">
.ug-bottom-audioplayer__sheet
  .ug-bottom-audioplayer__controls
    padding: 4px
    justify-content: center
    align-items: center
    .ug-bottom-audioplayer__controls__duration
      text-align: center
    .ug-bottom-audioplayer__controls__audio
      text-align: right
      padding-right: 20px
.ug-bottom-audioplayer__controls__audio__volume-content
  overflow: hidden
</style>

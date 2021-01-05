<template lang="pug">
.bottom-audio-player
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
    content-class='bottom-audio-player__sheet'
  )
    template(v-slot:activator='{ on, attrs }')
      template(v-if='duration > 0')
        slot(
          name='activator',
          :on='on',
          :attrs='attrs'
        )
          v-btn(
            v-on='on',
            v-bind='attrs',
            dark,
            color='red'
          )
            | Прослушать
      template(v-else)
        span.error--text Запись недоступна
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
      v-row.player-controls(no-gutters)
        v-col(cols='3')
          v-list-item
            v-list-item-content
              v-list-item-title {{ title }}
              v-list-item-subtitle {{ subtitle }}
        v-col.player-controls__duration(cols='6')
          span.grey--text {{ Math.ceil(currentTime) }}:{{ Math.ceil(duration) }}

        v-col.player-controls__audio-controls(cols='3')
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
            v-menu.player-controls__audio-controls__volume(
              :close-on-content-click='false',
              top,
              offset-y,
              content-class='player-controls__audio-controls__volume-content'
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

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from 'vue-property-decorator'

@Component
export default class MBottomAudioPlayer extends Vue {
  @Ref('player') player!: HTMLAudioElement
  @Prop() audio!: string
  @Prop() title!: string
  @Prop() subtitle!: string

  public sheet = false
  public isPaused = true
  public isEnded = false
  public duration = 0
  public currentTime = 0
  public progressBar = 0
  public volume = 0.5

  changeVolume() {
    if (this.sheet) {
      this.player.volume = this.volume
    }
  }

  onManualTimeChange(evt: any) {
    if (this.sheet) {
      this.player.currentTime = (this.duration * evt) / 100
    }
  }

  onManualTimeSeekStart() {
    this.player.pause()
  }

  onManualTimeSeekEnd() {
    if (this.sheet) {
      this.player.play()
    }
  }

  play() {
    if (this.sheet && this.currentTime === this.duration) {
      this.rewind()
      return
    }
    if (this.sheet && this.isPaused) {
      this.player.play()
    } else if (this.sheet) {
      this.player.pause()
    }
  }

  fastBackward() {
    this.player.pause()
    const calculated = this.currentTime - 5

    if (calculated < 0) {
      this.player.currentTime = 0
    } else {
      this.player.currentTime = calculated
    }
    this.player.play()
  }

  fastForward() {
    this.player.pause()
    const calculated = this.currentTime + 5.0

    if (calculated > this.duration) {
      this.player.currentTime = this.duration
    } else {
      this.player.currentTime = calculated
      this.player.play()
    }
  }

  rewind() {
    if (this.sheet) {
      this.player.currentTime = 0
      this.play()
    }
  }

  onPlay() {
    this.isPaused = false
  }

  onPause() {
    this.isPaused = true
  }

  onEnd() {
    this.isPaused = true
  }

  onDurationChange() {
    this.duration = this.player.duration
  }

  onTimeUpdate() {
    this.currentTime = this.player.currentTime

    this.progressBar = (this.currentTime / this.duration) * 100
  }
}
</script>

<style lang="sass">
.bottom-audio-player__sheet
  .player-controls
    padding: 4px
    justify-content: center
    align-items: center
    &__duration
      text-align: center
    &__audio-controls
      text-align: right
      padding-right: 20px

.player-controls__audio-controls__volume-content
  overflow: hidden
</style>

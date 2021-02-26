<template lang="pug">
v-dialog(
  v-model='display',
  :width='dialogWidth'
)
  template(v-slot:activator='{ on }')
    v-text-field(
      v-on='on',
      v-bind='textFieldProps',
      :value='selectedDatetime',
      :single-line='small',
      :prepend-inner-icon='icon',
      :outlined='!small',
      :loading='loading',
      :hide-details='small',
      :filled='small',
      :disabled='disabled',
      :color='fill',
      :class='{ "a-datetime-picker--small": small, [fill]: fill }',
      readonly,
      dense,
      color='primary'
    )
      template(#progress)
        slot(name='progress')
          v-progress-linear(
            indeterminate,
            height='2',
            color='primary',
            absolute
          )
  v-card
    v-card-text.px-0.py-0
      v-tabs(
        v-model='activeTab',
        fixed-tabs
      )
        v-tab(key='calendar')
          slot(name='dateIcon')
            v-icon mdi-calendar-clock
        v-tab(key='timer')
          slot(name='timeIcon')
            v-icon mdi-clock-check
        v-tab-item(key='calendar')
          v-date-picker(
            v-bind='datePickerProps',
            v-model='date',
            @input='showTimePicker',
            locale='ru-ru',
            full-width
          )
        v-tab-item(key='timer')
          v-time-picker.v-time-picker-custom(
            v-bind='timePickerProps',
            ref='timer',
            v-model='time',
            full-width='',
            format='24hr'
          )
    v-card-actions
      v-spacer
      slot(
        name='actions',
        :parent='this'
      )
        v-btn(
          @click.native='clearHandler',
          text='',
          color='grey lighten-1'
        ) {{ clearText }}
        v-btn(
          @click='okHandler',
          text='',
          color='green darken-1'
        ) {{ okText }}
</template>

<script lang="ts">
//* --------------------------------------------------------------------------
//!                        DEPRECATED NOT USED ANYWHERE
//* --------------------------------------------------------------------------

import moment from 'moment'
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'

const DEFAULT_DATE = ''
const DEFAULT_TIME = ''
const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy'
const DEFAULT_TIME_FORMAT = 'HH:mm'
const DEFAULT_DIALOG_WIDTH = 340
const DEFAULT_CLEAR_TEXT = 'Очистить'
const DEFAULT_OK_TEXT = 'Применить'

@Component({
  model: {
    prop: 'datetime',
    event: 'input',
  },
})
export default class ADatetimePicker extends Vue {
  @Prop({ type: [Date, String], default: DEFAULT_DATE }) datetime: any
  @Prop({ type: Boolean }) disabled: any
  @Prop({ type: Boolean }) loading: any
  @Prop({ type: String, default: '' }) label: any
  @Prop() add!: number
  @Prop() type!: 'hour' | 'day' | 'week' | 'month'
  @Prop(String) icon: any
  @Prop() small!: boolean
  @Prop({}) fill!: string

  @Ref('timer') timer: any

  public dialogWidth = DEFAULT_DIALOG_WIDTH
  public dateFormat = DEFAULT_DATE_FORMAT
  public timeFormat = DEFAULT_TIME_FORMAT
  public clearText = DEFAULT_CLEAR_TEXT
  public okText = DEFAULT_OK_TEXT
  public textFieldProps = {}
  public datePickerProps = {}
  public timePickerProps = {}

  public display = false
  public activeTab = 0
  public date = DEFAULT_DATE
  public time = DEFAULT_TIME

  @Watch('datetime')
  onDatetimeChange() {
    this.init()
  }

  get dateToDb() {
    return moment(this.selectedDatetime, 'DD.MM.YYYY HH:mm').toISOString()
  }

  get selectedDatetime() {
    if (this.date && this.time) {
      const date = moment(this.date, 'YYYY-MM-DD').locale('ru').format('DD.MM.YYYY')

      const time = moment(this.time, 'HH:mm').locale('ru').format('HH:mm')

      return `${date} ${time}`
    } else {
      return null
    }
  }

  init() {
    if (!this.datetime) {
      let m
      if (this.add && this.type) {
        m = moment().add(this.add, this.type)
      } else {
        m = moment().add(7, 'days')
      }
      this.date = m.format('YYYY-MM-DD')
      this.time = m.format('HH:mm')
      this.$emit('input', this.dateToDb)
    } else {
      const m = moment(this.datetime)
      this.date = m.format('YYYY-MM-DD')
      this.time = m.format('HH:mm')
    }
  }

  okHandler() {
    this.resetPicker()
    this.$emit('input', this.dateToDb)
  }

  clearHandler() {
    this.resetPicker()
    let m
    if (this.add && this.type) {
      m = moment().add(this.add, this.type)
    } else {
      m = moment().add(7, 'days')
    }
    this.date = m.format('YYYY-MM-DD')
    this.time = m.format('HH:mm')
    this.$emit('input', this.dateToDb)
  }

  resetPicker() {
    this.display = false
    this.activeTab = 0
    if (this.timer) {
      this.timer.selectingHour = true
    }
  }

  showTimePicker() {
    this.activeTab = 1
  }

  mounted() {
    this.init()
  }
}
</script>

<style lang="sass">
.a-datetime-picker--small
  transform: scale(0.73)
  transform-origin: inherit
  margin-left: -27px !important
</style>

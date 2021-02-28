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

<script>
import moment from 'moment'

const DEFAULT_DATE = ''
const DEFAULT_TIME = ''
const DEFAULT_DATE_FORMAT = 'dd.MM.yyyy'
const DEFAULT_TIME_FORMAT = 'HH:mm'
const DEFAULT_DIALOG_WIDTH = 340
const DEFAULT_CLEAR_TEXT = 'Очистить'
const DEFAULT_OK_TEXT = 'Применить'

export default {
  name: 'ug-datetime-picker-2',

  model: {
    prop: 'datetime',
    event: 'input',
  },

  props: {
    datetime: {
      required: false,
      type: [Date, String, Array],
    },

    disabled: {
      required: false,
      type: [Boolean],
    },

    loading: {
      required: false,
      type: [Boolean],
    },

    label: {
      required: false,
      type: [String],
    },

    add: {
      required: false,
      type: [Number],
    },

    type: {
      required: false,
      type: [String],
      validator: (v) => {
        return ['hours', 'day', 'week', 'month'].includes(v)
      },
    },

    icon: {
      required: false,
      type: [String],
    },

    small: {
      required: false,
      type: [Boolean],
    },

    fill: {
      required: false,
      type: [String],
    },
  },

  data: function () {
    return {
      dialogWidth: DEFAULT_DIALOG_WIDTH,
      dateFormat: DEFAULT_DATE_FORMAT,
      timeFormat: DEFAULT_TIME_FORMAT,
      clearText: DEFAULT_CLEAR_TEXT,
      okText: DEFAULT_OK_TEXT,
      textFieldProps: {},
      datePickerProps: {},
      timePickerProps: {},
      display: false,
      activeTab: 0,
      date: DEFAULT_DATE,
      time: DEFAULT_TIME,
    }
  },

  watch: {
    datetime: function () {
      this.init()
    },
  },

  computed: {
    dateToDb() {
      return moment(this.selectedDatetime, 'DD.MM.YYYY HH:mm').toISOString()
    },
    selectedDatetime() {
      if (this.date && this.time) {
        const date = moment(this.date, 'YYYY-MM-DD').locale('ru').format('DD.MM.YYYY')

        const time = moment(this.time, 'HH:mm').locale('ru').format('HH:mm')

        return `${date} ${time}`
      } else {
        return null
      }
    },
  },

  methods: {
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
    },

    okHandler() {
      this.resetPicker()
      this.$emit('input', this.dateToDb)
    },

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
    },

    resetPicker() {
      this.display = false
      this.activeTab = 0
      if (this.timer) {
        this.timer.selectingHour = true
      }
    },

    showTimePicker() {
      this.activeTab = 1
    },
  },

  mounted: function () {
    this.init()
  },
}
</script>

<style lang="sass">
.a-datetime-picker--small
  transform: scale(0.73)
  transform-origin: inherit
  margin-left: -27px !important
</style>

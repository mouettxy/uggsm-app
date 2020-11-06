<template lang="pug">
.order-time-label
  template(v-if='editable')
    v-slide-y-reverse-transition(leave-absolute)
      .order-time-label__editable-text(v-if='!editMode')
        template(v-if='invalidDate')
          v-chip(
            :small='small',
            @click='enableEditMode',
            label,
            color='warning'
          ) Некорректная дата
        template(v-else)
          v-chip(
            :small='small',
            :color='chipColor',
            @click='enableEditMode',
            label
          ) {{ dateString }}
    v-slide-y-transition(
      leave-absolute,
      hide-on-leave
    )
      .order-time-label__editable-input(v-if='editMode')
        a-datetime-picker.editable-input__field(
          v-model='model',
          :fill='chipColor',
          :add='24',
          @input='onTimeChange',
          type='hours',
          small,
          label='Дата готовности',
          icon='mdi-alarm-check'
        )
        v-btn.editable-input__close(
          @click='disableEditMode',
          icon,
          color='error'
        )
          v-icon mdi-close
  template(v-else)
    template(v-if='invalidDate')
      v-chip(
        :small='small',
        label,
        color='warning'
      ) Некорректная дата
    template(v-else)
      v-chip(
        :small='small',
        :color='chipColor',
        label
      ) {{ dateString }}
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import moment from 'moment'
import { includes } from 'lodash'
import { Order } from '@/typings/api/order'
import { ordersModule } from '@/store'

@Component
export default class MOrderTimeLabel extends Vue {
  @Prop({ required: true }) time!: string | null
  @Prop({ required: true }) orderStatus!: string
  @Prop({ default: false }) small!: boolean
  @Prop() path!: string
  @Prop() editable!: boolean
  @Prop() orderid!: string | number

  public invalidDate = false
  public editMode = false

  @Watch('time')
  onTimeUpdate(value: string) {
    if (value === 'Invalid date' || value === 'Invalid date Invalid date' || value === null) {
      this.invalidDate = true
    } else {
      this.invalidDate = false
    }
  }

  get model() {
    return this.time
  }

  set model(value) {
    this.$emit('change', value)
  }

  get dateString() {
    return moment(this.time).format('DD.MM.YYYY HH:mm')
  }

  get isExpired() {
    return (
      moment(this.time).isBefore(moment()) &&
      !includes(['Закрыт', 'Выкуплен СЦ', 'Обещали найти', 'Закрыт с вопросом'], this.orderStatus)
    )
  }

  get chipColor() {
    return this.isExpired ? 'error' : 'softgrey'
  }

  enableEditMode() {
    this.editMode = true
  }

  disableEditMode() {
    this.editMode = false
  }

  async onTimeChange(evt: any) {
    const response = await ordersModule.setEstimatedCloseAt({ orderid: this.orderid, time: evt })

    if (response) {
      this.$notification.success('Успешная смена срока заказа')
      this.disableEditMode()
    } else {
      this.$notification.error('Ошибка при смене срока заказа')
    }
  }

  mounted() {
    if (this.time === 'Invalid date' || this.time === 'Invalid date Invalid date' || this.time === null) {
      this.invalidDate = true
    }
  }
}
</script>

<style lang="sass">
.order-time-label
  &__editable-input
    display: flex
    position: relative
    .editable-input__close
      position: absolute
      top: -2px
      right: 16px
</style>

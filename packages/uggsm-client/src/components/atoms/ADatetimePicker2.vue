<template lang="pug">
date-picker.datetime-picker-2(
  v-model='model',
  :type='type',
  :range='range',
  :format='format',
  :clearable='false',
  value-type='format',
  placeholder='дату'
)
  template(#input='{props}')
    a-input(
      v-model='props.value',
      :label='label',
      :icon='icon',
      hide-details,
      dense
    )
  template(#icon-calendar)
    span
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import DatePicker from 'vue2-datepicker'
import '@/sass/vue2-datepicker.sass'
import 'vue2-datepicker/locale/ru'
import moment from 'moment'
import { isArray } from 'lodash'

@Component({
  components: {
    DatePicker,
  },
})
export default class ADatetimePicker2 extends Vue {
  @Prop({ type: [String, Date, Array] }) value!: string | Date | Array<string | Date>
  @Prop({ type: Boolean }) range!: boolean
  @Prop({ default: 'DD.MM.YYYY' }) format!: string
  @Prop({ default: 'date' }) type!: string
  @Prop({ default: 'За дату' }) label!: string
  @Prop() returnIsoString!: boolean
  @Prop() icon!: string

  get model() {
    if (this.returnIsoString) {
      return moment(this.value as string).format(this.format)
    }

    return this.value
  }

  set model(value) {
    if (this.returnIsoString) {
      this.$emit('input', moment(value as string, this.format).toISOString())
    } else {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="sass"></style>

<template lang="pug">
date-picker.datetime-picker-2(
  v-model='model',
  :range='range',
  :clearable='false',
  value-type='format',
  placeholder='дату',
  format='DD.MM.YYYY'
)
  template(#input='{props}')
    a-input(
      v-model='props.value',
      label='За дату',
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

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="sass"></style>

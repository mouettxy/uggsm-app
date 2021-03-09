<template lang="pug">
#print-receipt(style='width: 100%; height: 100%')
  m-print-repair-contract(v-bind='$props')

  div(style='font-size: 14px; text-align: center') --------------------------------------------------------------------------------------------------------------------

  m-print-repair-contract(v-bind='$props')
  div(style='font-size: 14px; text-align: center')
    br
    p Я надеюсь на удачу, хочу забрать из ремонта, не дожидаясь полного высыхания и проверки. Претензий к работе не имею, понимаю, что гарантии на ремонт НЕТ. {{ customerName }} (роспись)___________

  div(style='font-size: 14px; text-align: center') --------------------------------------------------------------------------------------------------------------------
  m-print-warranty(v-bind='$props')

  div(style='font-size: 14px; text-align: center') --------------------------------------------------------------------------------------------------------------------

  m-print-adversitement(v-bind='$props')
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class MPrintReceipt extends Vue {
  @Prop({ type: [String, Number] }) orderId!: string | number

  @Prop({ type: [String, Number] }) createdAt!: string

  @Prop({ type: [String, Number] }) customerName!: string

  @Prop({ type: [String, Number] }) customerPhone!: string

  @Prop({ type: [String, Number] }) phoneModel!: string

  @Prop({ type: [String, Number] }) serialNumber!: string

  @Prop({ type: [String, Number] }) declaredDeffect!: string

  @Prop({ type: [String, Number] }) password!: string

  @Prop({ type: [String, Number] }) appearance!: string

  @Prop({ type: [String, Number] }) kit!: string

  @Prop({ type: [String, Number] }) estimatedCloseAt!: string

  @Prop({ type: [String, Number] }) declaredPrice!: string

  @Prop({ type: [String, Number] }) avance!: string

  get year() {
    return new Date().getFullYear()
  }

  get customerPhoneFormatted() {
    return this.customerPhone
  }
}
</script>

<style lang="sass"></style>

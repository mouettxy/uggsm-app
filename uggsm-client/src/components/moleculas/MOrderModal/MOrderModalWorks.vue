<template lang="pug">
.order-modal-works
  .text-h5 Выполненная работа
  a-autocomplete(
    v-model='work',
    label='Выполненная работа',
    icon='mdi-account-cowboy-hat',
    endpoint='/completed-work',
    dense
  )
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { ordersModule } from '@/store'

@Component
export default class MOrderModalWorks extends Vue {
  @Prop({ required: true, type: Boolean }) newOrder!: boolean

  public work = ''

  get order() {
    return ordersModule.currentOrder
  }
}
</script>

<style lang="sass"></style>

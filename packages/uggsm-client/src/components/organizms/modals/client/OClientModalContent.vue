<template lang="pug">
.client-modal-content
  header.content-header.softgrey.elevation-1
    .content-header__left
      h5.text-h5.ml-1 Клиент
      v-chip.ml-1(
        v-if='screenWidth > 666',
        small,
        label,
        color='primary'
      )
        span {{ client.name }}
      v-chip.ml-1(
        v-if='screenWidth > 666',
        small,
        label,
        color='secondary'
      )
        span {{ client.clientType }}
      v-slide-y-reverse-transition
        v-chip.ml-1(
          v-if='client.isConflict && screenWidth > 666',
          small,
          label,
          color='error'
        )
          span Конфликтный
      v-slide-y-reverse-transition
        v-chip.ml-1(
          v-if='client.isProvider && screenWidth > 666',
          small,
          label,
          color='success'
        )
          span Поставщик
    .content-header__right
      v-slide-y-reverse-transition
        v-icon.pa-2(
          v-if='client.allowedEmailNotifications && screenWidth > 666',
          size='1.4rem',
          color='success'
        ) mdi-email-check
      v-slide-y-reverse-transition
        v-icon.pa-2(
          v-if='client.allowedNotifications && screenWidth > 666',
          size='1.4rem',
          color='success'
        ) mdi-message
  section.content-body
    o-client-modal-fields(:client='client')
</template>

<script lang="ts">
import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
import { Client, ClientInput } from '@/typings/api/client'
import Responsive from '@/mixins/responive'

@Component
export default class OClientModalContent extends Mixins(Responsive) {
  @Prop(Object) client!: Client
}
</script>

<style lang="sass">
.client-modal-content
  .content-header
    display: flex
    justify-content: space-between
    padding: 12px
    &__left
      display: flex
      align-items: center
  .content-body
    overflow-y: scroll
    height: calc(100vh - 100px)
    padding: 12px
</style>

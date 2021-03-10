<template lang="pug">
header.ug-modal-client-header.softgrey
  v-progress-linear(
    :active='isClientLoading',
    top,
    indeterminate,
    absolute
  )
  .ug-modal-client-header__left(v-if='client')
    h5.text-h5 Клиент
    ug-base-chip(
      v-if='!isMobile && client && client.name',
      small,
      color='primary'
    )
      span {{ client.name }}

    ug-base-chip(
      v-if='!isMobile && client && client.clientType',
      small,
      color='secondary'
    )
      span {{ client.clientType }}
  .ug-mpdal-client-header__right(v-if='client')
    v-slide-y-reverse-transition
      v-icon(
        v-if='client && client.allowedEmailNotifications',
        size='1.4rem',
        color='success'
      ) mdi-email-check

    v-slide-y-reverse-transition
      v-icon(
        v-if='client && client.allowedNotifications',
        size='1.4rem',
        color='success'
      ) mdi-message
    ug-base-btn(
      @click='$emit("close", $event)',
      icon='mdi-close'
    )
</template>

<script>
import UgBaseChip from '@/components/base/ui/base-chip/base-chip'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import Responsive from '@/mixins/responive'

export default {
  name: 'ug-modal-client-header',

  components: {
    UgBaseChip,
    UgBaseBtn,
  },

  mixins: [Responsive],

  props: {
    client: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    isClientLoading: {
      required: false,
      type: Boolean,
    },
  },
}
</script>

<style lang="sass">
.ug-modal-client-header
  display: flex
  justify-content: space-between
  padding: 12px
  .ug-modal-client-header__left
    display: flex
    gap: 8px
    align-items: center
  .ug-mpdal-client-header__right
    display: flex
    gap: 8px
</style>

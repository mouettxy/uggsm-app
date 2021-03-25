<template lang="pug">
.orders-table
  m-remote-table(
    :store='store',
    :display-office-switcher='false'
  )
    template(#top-toolbar='{store}')
      ug-base-btn.ml-4.dark--text(
        :to='{ name: "clientsNext" }',
        label='Новая таблица',
        color='warning'
      )
    template(#item.name='{value, item}')
      v-list-item
        v-list-item-content
          v-list-item-title {{ value }}
          v-list-item-subtitle {{ item.type }}
    template(#item.phone='{value}')
      v-tooltip(
        v-for='v in value',
        :key='v.id',
        left
      )
        template(#activator='{on, attrs}')
          a.d-block(
            v-on='on',
            v-bind='attrs',
            :href='`tel:+7${v.phone}`'
          ) {{ v.phone | VMask("+7 (###) ###-##-##") }}
        span {{ v.comment }}
    template(#item.notifications='{value}')
      v-icon.pa-2(
        v-if='value.email',
        size='1.4rem',
        color='success'
      ) mdi-email-check
      v-icon.pa-2(
        v-if='value.sms',
        size='1.4rem',
        color='success'
      ) mdi-message
    template(#item.id='{value}')
      ug-modal-client(:clientid='value')
</template>

<script lang="ts">
import UgModalClient from '@/components/client/modal-client/modal-client.vue'
import { Component, Vue } from 'vue-property-decorator'
import { clientModule } from '@/store'

@Component({
  components: {
    UgModalClient,
  },
})
export default class OClientsTable extends Vue {
  get store() {
    return clientModule
  }

  update() {
    this.loadItems()
  }

  async loadItems() {
    await clientModule.fetchTable()
  }

  created() {
    this.loadItems()
  }
}
</script>

<style lang="sass">
.orders-table
  .orders-table-toolbar
    .v-toolbar__content
      padding: 0 !important
      padding-right: 16px !important
</style>

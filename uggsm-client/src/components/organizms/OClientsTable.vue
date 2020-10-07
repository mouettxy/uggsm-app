<template lang="pug">
.orders-table
  v-toolbar.orders-table-toolbar(flat)
    v-spacer
    v-menu(
      v-model='columnsMenu',
      :close-on-content-click='false',
      offset-x=''
    )
      template(#activator='{ on, attrs }')
        v-btn(
          v-on='on',
          v-bind='attrs',
          icon
        )
          v-icon mdi-table-large
      v-card
        v-list
          v-list-item(
            v-for='header in headers',
            :key='header.value'
          )
            v-list-item-action
              v-switch(v-model='header.show')
            v-list-item-title {{ header.text }}
  v-data-table(
    :server-items-length='totalItems',
    :options.sync='options',
    :loading='isLoading',
    :items='items',
    :headers='headersFormatted',
    :calculate-widths='true',
    @update:sort-desc='update',
    @update:sort-by='update',
    @update:page='update',
    @update:items-per-page='update',
    no-data-text='Не найдено клиентов',
    multi-sort,
    locale='ru',
    loading-text='Загружаем клиентов...',
    item-key='id',
    hide-default-footer,
    height='calc(100vh - 230px)'
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
          ) +7 {{ v.phone }}
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
  v-pagination.mt-4(
    v-model='options.page',
    :length='Math.round(totalItems / options.itemsPerPage)',
    :current-page='options.page',
    total-visible='9'
  )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { clientModule } from '@/store'
import { filter } from 'lodash'

@Component
export default class OClientsTable extends Vue {
  public columnsMenu = false
  public headers: any = [
    {
      text: '№',
      value: 'id',
      show: true,
    },
    {
      text: 'Имя',
      value: 'name',
      show: true,
    },
    {
      text: 'Почта',
      value: 'email',
      show: true,
    },
    {
      text: 'Телефон',
      value: 'phone',
      show: true,
    },
    {
      text: 'Адрес',
      value: 'address',
      show: true,
    },
    {
      text: 'Дата создания клиента',
      value: 'createdAt',
      show: true,
    },
    {
      text: 'Уведомления',
      value: 'notifications',
      show: true,
    },
  ]

  get headersFormatted() {
    return filter(this.headers, (e) => {
      return e.show
    })
  }

  get isLoading() {
    return clientModule.isLoading
  }

  get items() {
    return clientModule.clientTable
  }

  get options() {
    return clientModule.options
  }

  set options(value) {
    clientModule.setOptions(value)
  }

  get totalItems() {
    return clientModule.countRows
  }

  update() {
    this.loadItems()
  }

  async loadItems() {
    await clientModule.fetch()
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

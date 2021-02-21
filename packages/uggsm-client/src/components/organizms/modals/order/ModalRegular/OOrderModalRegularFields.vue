<template lang="pug">
.order-modal-fields
  .order-modal-fields__label Клиент
  v-row(no-gutters)
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      v-list-item(two-line)
        v-list-item-content
          v-list-item-title
            template(v-if='model.customer && model.customer.id')
              o-client-modal(:clientid='model.customer.id')
                template(#activator='{on, attrs}')
                  div(
                    v-on='on',
                    v-bind='attrs'
                  )
                    v-icon(
                      size='1.1rem',
                      color='dark'
                    ) mdi-pencil
                    span {{ model.customer.name }}
            template(v-else)
              span.error--text {{ model.customerName }}
          v-list-item-subtitle Имя клиента
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      v-list-item(two-line)
        v-list-item-content
          v-list-item-title {{ model.customerPhone | VMask("+7 (###) ###-##-##") }}
          v-list-item-subtitle Номер клиента

  .order-modal-fields__label Заказ

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-input.mb-6(
        v-model='model.serialNumber',
        :disabled='canEditGeneralFields',
        label='Серийный номер',
        icon='mdi-fingerprint',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-input(
        v-model='model.declaredPrice',
        :disabled='canEditGeneralFields',
        type='number',
        label='Ориентировочная цена',
        icon='mdi-cash',
        dense
      )

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.phoneBrand',
        :predefined-items='model.phoneBrand ? [{ text: model.phoneBrand, value: model.phoneBrand }] : []',
        :disabled='canEditGeneralFields',
        label='Бренд',
        icon='mdi-cellphone-information',
        endpoint='/phone-brand',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.phoneModel',
        :predefined-items='model.phoneModel ? [{ text: model.phoneModel, value: model.phoneModel }] : []',
        :disabled='canEditGeneralFields',
        label='Модель',
        icon='mdi-cellphone-information',
        endpoint='/phone-model',
        dense
      )

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.declaredDefect',
        :predefined-items='model.declaredDefect ? [{ text: model.declaredDefect, value: model.declaredDefect }] : []',
        :disabled='canEditGeneralFields',
        label='Первичная неисправность',
        icon='mdi-cellphone-erase',
        endpoint='/declared-defect',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.appearance',
        :predefined-items='model.appearance ? [{ text: model.appearance, value: model.appearance }] : []',
        :disabled='canEditGeneralFields',
        label='Внешний вид',
        icon='mdi-cellphone-text',
        endpoint='/appearance',
        dense
      )

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.kit',
        :predefined-items='model.kit ? [{ text: model.kit, value: model.kit }] : []',
        :disabled='canEditGeneralFields',
        label='Комплектация',
        icon='mdi-cellphone-cog',
        endpoint='/kit',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-switch.order-modal-fields__section-item__switch(
        v-model='model.quick',
        :disabled='canEditGeneralFields',
        label='Срочно',
        icon='mdi-alarm-light',
        color='error'
      )

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.master._id',
        :predefined-items='model.master ? [{ text: model.master.credentials, value: model.master._id }] : []',
        :disabled='isMasterFieldDisabled',
        label='Мастер',
        icon='mdi-account-hard-hat',
        endpoint='/master',
        disallow-free-type,
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.manager._id',
        :predefined-items='model.manager ? [{ text: model.manager.credentials, value: model.manager._id }] : []',
        :disabled='isManagerFieldDisabled',
        label='Менеджер',
        icon='mdi-account-cowboy-hat',
        endpoint='/manager',
        disallow-free-type,
        dense
      )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getAnonymousAnimal } from '@/api/helpers'

@Component
export default class OOrderModalRegularFields extends Vue {
  @Prop({ required: true }) value!: any

  get model() {
    return this.value
  }

  set model(value) {
    this.$emit('input', value)
  }

  get canEditGeneralFields() {
    return !this.$can('editOrder', 'Global')
  }

  get isMasterFieldDisabled() {
    if (this.$can('editOrderMaster', 'Global')) {
      return false
    }

    return true
  }

  get isManagerFieldDisabled() {
    if (this.$can('editOrderManager', 'Global')) {
      return false
    }

    return true
  }

  isObjectId(string: string) {
    if (string.match(/^[0-9a-fA-F]{24}$/)) {
      return true
    } else {
      return false
    }
  }

  created() {
    if (!this.model.manager) {
      this.model.manager = {
        _id: '',
        credentials: getAnonymousAnimal(),
      }
    }

    if (!this.model.master) {
      this.model.master = {
        _id: '',
        credentials: getAnonymousAnimal(),
      }
    }
  }
}
</script>

<style lang="sass">
.order-modal-fields
  padding: 12px
  &:not(.order-modal-fields--mobile)
    .order-modal-fields__section
      margin-top: 6px
      margin-bottom: -12px
      &-item__switch
        margin-top: 4px
      &-item
        padding-left: 6px
      &-item:first-child
        padding-left: 0
  &.order-modal-fields--mobile
    .order-modal-fields__section
      margin-top: 6px
      margin-bottom: -12px
      &-item__switch
        margin-top: -16px
        margin-bottom: 24px
  .order-modal-fields__label
    margin-bottom: 6px
    background: #fafafa
    padding: 4px
    font-size: 1.3rem
</style>

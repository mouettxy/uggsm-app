<template lang="pug">
.order-modal-fields.order-modal-fields--new(:class='{ "order-modal-fields--mobile": isMobile }')
  .order-modal-fields__label Клиент
  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='4',
      lg='4'
    )
      a-autocomplete(
        v-model='model.customerName',
        :icon='customerNameIcon',
        label='Имя клиента',
        endpoint='/customer-name',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='4',
      lg='4'
    )
      a-autocomplete(
        v-model='model.customerPhone',
        :replaceSearchWith='model.customerName',
        phone,
        label='Телефон клиента',
        icon='mdi-phone',
        endpoint='/customer-phone',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='4',
      lg='4'
    )
      a-input(
        v-model='model.password',
        :hide-details='false',
        label='Пароль',
        icon='mdi-cellphone-key',
        dense
      )

  .order-modal-fields__label Заказ

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-input.mb-6(
        v-model='model.serialNumber',
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
        :hide-details='false',
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
      a-switch.order-modal-fields__section-item__switch(
        v-model='model.quick',
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
        v-model='model.appearance',
        :predefined-items='[{ value: "царапины и потёртости", text: "царапины и потёртости" }]',
        label='Внешний вид',
        icon='mdi-cellphone-text',
        endpoint='/appearance',
        dense
      )
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.kit',
        :predefined-items='[{ value: "устройство без сим карты, чехла, карты памяти", text: "устройство без сим карты, чехла, карты памяти" }]',
        label='Комплектация',
        icon='mdi-cellphone-cog',
        endpoint='/kit',
        dense
      )

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(cols='12')
      a-datetime-picker(
        v-model='model.estimatedCloseAt',
        :add='24',
        type='hours',
        label='Дата готовности',
        icon='mdi-alarm-check'
      )

  v-divider.mb-4

  v-row.order-modal-fields__section(no-gutters)
    v-col.order-modal-fields__section-item(
      cols='12',
      md='6',
      lg='6'
    )
      a-autocomplete(
        v-model='model.master',
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
        :disabled='isObjectId(model.manager._id)',
        label='Менеджер',
        icon='mdi-account-cowboy-hat',
        endpoint='/manager',
        disallow-free-type,
        dense
      )
</template>

<script lang="ts">
import { getAnonymousAnimal } from '@/api/helpers'
import { authModule } from '@/store'
import { Component, Prop, Mixins, Watch } from 'vue-property-decorator'
import Responsive from '@/mixins/responive'

@Component
export default class OOrderModalNewFields extends Mixins(Responsive) {
  @Prop() value!: Record<string, any>

  public customerNameIcon = 'mdi-account-plus'
  @Watch('customerName')
  async onCustomerNameChange() {
    await this.isClientExists()
  }
  get customerName() {
    return this.model.customerName
  }
  async isClientExists() {
    try {
      const response = await this.$axios.get('/autocomplete/customer-phone', {
        params: { search: this.model.customerName },
      })

      if (response.data.length > 0) {
        this.customerNameIcon = 'mdi-account-check'
      } else {
        this.customerNameIcon = 'mdi-account-plus'
      }
    } catch (error) {
      this.customerNameIcon = 'mdi-account-plus'
    }
  }

  get model() {
    return this.value
  }

  set model(value: Record<string, any>) {
    this.$emit('input', value)
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
        _id: authModule.user?._id,
        credentials: authModule.user?.credentials,
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
  &.order-modal-fields--new
    .order-modal-fields__label
      margin-bottom: 6px
      background: #fafafa
      padding: 4px
      font-size: 1.3rem
</style>

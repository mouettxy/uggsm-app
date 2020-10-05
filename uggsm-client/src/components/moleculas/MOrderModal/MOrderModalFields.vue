<template lang="pug">
.order-modal-fields
  template(v-if='newOrder')
    a-select(
      v-model='model.orderType',
      :icon='model.orderType === "Платный" ? "mdi-cash-check" : "mdi-cash-lock"',
      :items='["Платный", "По гарантии"]',
      dense,
      label='Тип заказа',
      value='Платный'
    )
    .text-h5.my-4 Клиент
    a-autocomplete(
      v-model='model.customerName',
      :icon='customerNameIcon',
      dense,
      endpoint='/customer-name',
      label='Имя клиента'
    )
    a-autocomplete(
      v-model='model.customerPhone',
      :replaceSearchWith='model.customerName',
      dense,
      endpoint='/customer-phone',
      icon='mdi-phone',
      label='Телефон клиента'
    )
    a-input(
      v-model='model.password',
      dense,
      icon='mdi-cellphone-key',
      label='Пароль'
    )
    .text-h5.my-4 Заказ
    a-input(
      v-model='model.serialNumber',
      dense,
      icon='mdi-fingerprint',
      label='Серийный номер'
    )
    a-autocomplete(
      v-model='model.phoneBrand',
      dense,
      endpoint='/phone-brand',
      icon='mdi-cellphone-information',
      label='Бренд'
    )
    a-autocomplete(
      v-model='model.phoneModel',
      dense,
      endpoint='/phone-model',
      icon='mdi-cellphone-information',
      label='Модель'
    )
    a-autocomplete(
      v-model='model.declaredDefect',
      dense,
      endpoint='/declared-defect',
      icon='mdi-cellphone-erase',
      label='Первичная неисправность'
    )
    a-autocomplete(
      v-model='model.appearance',
      dense,
      endpoint='/appearance',
      icon='mdi-cellphone-text',
      label='Внешний вид'
    )
    a-autocomplete(
      v-model='model.kit',
      dense,
      endpoint='/kit',
      icon='mdi-cellphone-cog',
      label='Комплектация'
    )
    a-input(
      v-model='model.declaredPrice',
      dense,
      icon='mdi-cash',
      label='Ориентировочная цена'
    )
    a-switch.mb-6(
      v-model='model.quick',
      icon='mdi-alarm-light',
      label='Срочно'
    )
    a-datetime-picker(
      v-model='model.estimatedCloseAt',
      icon='mdi-alarm-check',
      label='Дата готовности'
    )
    v-divider.mb-8
    a-autocomplete(
      v-model='model.master',
      dense,
      endpoint='/master',
      icon='mdi-account-hard-hat',
      label='Мастер'
    )
    a-autocomplete(
      v-model='model.manager',
      dense,
      endpoint='/manager',
      icon='mdi-account-cowboy-hat',
      label='Менеджер'
    )
  template(v-if='!newOrder')
    a-select(
      v-model='model.orderType',
      :clearable='false',
      :items='[model.orderType]',
      dense,
      readonly
    )
    .text-h5 Клиент
    v-list
      v-list-item(two-line)
        v-list-item-content
          v-list-item-title {{ model.customerName }}
          v-list-item-subtitle Имя клиента
      v-list-item
        v-list-item-content
          v-list-item-title {{ model.customerPhone }}
          v-list-item-subtitle Номер клиента
    .text-h5 Заказ
      .ml-4.mt-8
        a-input(
          v-model='model.serialNumber',
          dense,
          icon='mdi-fingerprint',
          label='Серийный номер'
        )
        a-autocomplete(
          v-model='model.phoneBrand',
          :predefined-items='model.phoneBrand ? [{ text: model.phoneBrand, value: model.phoneBrand }] : []',
          dense,
          endpoint='/phone-brand',
          icon='mdi-cellphone-information',
          label='Бренд'
        )
        a-autocomplete(
          v-model='model.phoneModel',
          :predefined-items='model.phoneModel ? [{ text: model.phoneModel, value: model.phoneModel }] : []',
          dense,
          endpoint='/phone-model',
          icon='mdi-cellphone-information',
          label='Модель'
        )
        a-autocomplete(
          v-model='model.declaredDefect',
          :predefined-items='model.declaredDefect ? [{ text: model.declaredDefect, value: model.declaredDefect }] : []',
          dense,
          endpoint='/declared-defect',
          icon='mdi-cellphone-erase',
          label='Первичная неисправность'
        )
        a-autocomplete(
          v-model='model.appearance',
          :predefined-items='model.appearance ? [{ text: model.appearance, value: model.appearance }] : []',
          dense,
          endpoint='/appearance',
          icon='mdi-cellphone-text',
          label='Внешний вид'
        )
        a-autocomplete(
          v-model='model.kit',
          :predefined-items='model.kit ? [{ text: model.kit, value: model.kit }] : []',
          dense,
          endpoint='/kit',
          icon='mdi-cellphone-cog',
          label='Комплектация'
        )
        a-input(
          v-model='model.declaredPrice.toString()',
          dense,
          icon='mdi-cash',
          label='Ориентировочная цена'
        )
        a-switch.mb-6(
          v-model='model.quick',
          icon='mdi-alarm-light',
          label='Срочно'
        )
        a-datetime-picker(
          v-model='model.estimatedCloseAt',
          icon='mdi-alarm-check',
          label='Дата готовности'
        )
        v-divider.mb-8
        a-autocomplete(
          v-model='model.master._id',
          :predefined-items='model.master ? [{ text: model.master.credentials, value: model.master._id }] : []',
          dense,
          endpoint='/master',
          icon='mdi-account-hard-hat',
          label='Мастер'
        )
        a-autocomplete(
          v-model='model.manager._id',
          :predefined-items='model.manager ? [{ text: model.manager.credentials, value: model.manager._id }] : []',
          dense,
          endpoint='/manager',
          icon='mdi-account-cowboy-hat',
          label='Менеджер'
        )
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'

@Component
export default class MOrderModalFields extends Vue {
  @Prop(Boolean) newOrder: any
  @Prop(Object) value: any

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

  set model(value) {
    this.$emit('input', value)
  }
}
</script>

<style lang="sass"></style>

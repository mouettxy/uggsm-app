<template lang="pug">
.order-modal-fields
  template(v-if='newOrder')
    a-select(
      v-model='model.orderType',
      :items='["Платный", "По гарантии"]',
      :icon='model.orderType === "Платный" ? "mdi-cash-check" : "mdi-cash-lock"',
      value='Платный',
      label='Тип заказа',
      dense
    )
    .text-h5.my-4 Клиент
    a-autocomplete(
      v-model='model.customerName',
      :icon='customerNameIcon',
      label='Имя клиента',
      endpoint='/customer-name',
      dense
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
    a-input(
      v-model='model.password',
      label='Пароль',
      icon='mdi-cellphone-key',
      dense
    )
    .text-h5.my-4 Заказ
    a-input.mb-6(
      v-model='model.serialNumber',
      label='Серийный номер',
      icon='mdi-fingerprint',
      dense
    )
    a-autocomplete(
      v-model='model.phoneBrand',
      label='Бренд',
      icon='mdi-cellphone-information',
      endpoint='/phone-brand',
      dense
    )
    a-autocomplete(
      v-model='model.phoneModel',
      label='Модель',
      icon='mdi-cellphone-information',
      endpoint='/phone-model',
      dense
    )
    a-autocomplete(
      v-model='model.declaredDefect',
      label='Первичная неисправность',
      icon='mdi-cellphone-erase',
      endpoint='/declared-defect',
      dense
    )
    a-input(
      v-model='model.declaredPrice',
      label='Ориентировочная цена',
      icon='mdi-cash',
      dense
    )
    a-switch.mb-6(
      v-model='model.quick',
      label='Срочно',
      icon='mdi-alarm-light'
    )
    a-datetime-picker-2.mb-6.d-block(
      v-model='model.estimatedCloseAt',
      type='datetime',
      label='Ориентировочная дата готовности',
      icon='mdi-alarm-check',
      format='DD.MM.YYYY HH:mm'
    )
    a-autocomplete(
      v-model='model.appearance',
      :predefined-items='[{ value: "царапины и потёртости", text: "царапины и потёртости" }]',
      label='Внешний вид',
      icon='mdi-cellphone-text',
      endpoint='/appearance',
      dense
    )
    a-autocomplete(
      v-model='model.kit',
      :predefined-items='[{ value: "устройство без сим карты, чехла, карты памяти", text: "устройство без сим карты, чехла, карты памяти" }]',
      label='Комплектация',
      icon='mdi-cellphone-cog',
      endpoint='/kit',
      dense
    )
    v-divider.mb-8
    a-autocomplete(
      v-model='model.master',
      label='Мастер',
      icon='mdi-account-hard-hat',
      endpoint='/master',
      disallow-free-type,
      dense
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
  template(v-if='!newOrder')
    a-select(
      v-model='model.orderType',
      :items='[model.orderType]',
      :clearable='false',
      readonly,
      dense
    )
    .text-h5 Клиент
    v-list
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
      v-list-item(two-line)
        v-list-item-content
          v-list-item-title {{ model.customerPhone }}
          v-list-item-subtitle Номер клиента
    .text-h5 Заказ
      .ml-4.mt-8
        a-input.mb-6(
          v-model='model.serialNumber',
          label='Серийный номер',
          icon='mdi-fingerprint',
          dense
        )
        a-autocomplete(
          v-model='model.phoneBrand',
          :predefined-items='model.phoneBrand ? [{ text: model.phoneBrand, value: model.phoneBrand }] : []',
          label='Бренд',
          icon='mdi-cellphone-information',
          endpoint='/phone-brand',
          dense
        )
        a-autocomplete(
          v-model='model.phoneModel',
          :predefined-items='model.phoneModel ? [{ text: model.phoneModel, value: model.phoneModel }] : []',
          label='Модель',
          icon='mdi-cellphone-information',
          endpoint='/phone-model',
          dense
        )
        a-autocomplete(
          v-model='model.declaredDefect',
          :predefined-items='model.declaredDefect ? [{ text: model.declaredDefect, value: model.declaredDefect }] : []',
          label='Первичная неисправность',
          icon='mdi-cellphone-erase',
          endpoint='/declared-defect',
          dense
        )
        a-input(
          v-model='model.declaredPrice',
          type='number',
          label='Ориентировочная цена',
          icon='mdi-cash',
          dense
        )
        a-switch.mb-6(
          v-model='model.quick',
          label='Срочно',
          icon='mdi-alarm-light'
        )
        a-autocomplete(
          v-model='model.appearance',
          :predefined-items='model.appearance ? [{ text: model.appearance, value: model.appearance }] : []',
          label='Внешний вид',
          icon='mdi-cellphone-text',
          endpoint='/appearance',
          dense
        )
        a-autocomplete(
          v-model='model.kit',
          :predefined-items='model.kit ? [{ text: model.kit, value: model.kit }] : []',
          label='Комплектация',
          icon='mdi-cellphone-cog',
          endpoint='/kit',
          dense
        )
        a-datetime-picker(
          v-model='model.estimatedCloseAt',
          label='Дата готовности',
          icon='mdi-alarm-check'
        )
        v-divider.mb-8
        a-autocomplete(
          v-model='model.master._id',
          :predefined-items='model.master ? [{ text: model.master.credentials, value: model.master._id }] : []',
          label='Мастер',
          icon='mdi-account-hard-hat',
          endpoint='/master',
          disallow-free-type,
          dense
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
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { getAnonymousAnimal } from '@/api/helpers'
import { authModule } from '@/store'

@Component
export default class OOrderModalFields extends Vue {
  @Prop({ default: true }) newOrder!: boolean
  @Prop({ required: true }) value!: any

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

  isObjectId(string: string) {
    if (string.match(/^[0-9a-fA-F]{24}$/)) {
      return true
    } else {
      return false
    }
  }

  created() {
    if (!this.model.manager) {
      if (this.newOrder) {
        this.model.manager = {
          _id: authModule.user?._id,
          credentials: authModule.user?.credentials,
        }
      } else {
        this.model.manager = {
          _id: '',
          credentials: getAnonymousAnimal(),
        }
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

<style lang="sass"></style>

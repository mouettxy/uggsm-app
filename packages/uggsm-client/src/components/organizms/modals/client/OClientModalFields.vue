<template lang="pug">
.client-modal-fields
  v-row.fields-section
    v-col.fields-section__info(
      cols='12',
      md='8',
      lg='8'
    )
      v-row
        v-col(
          cols='12',
          md='8',
          lg='8'
        )
          a-input(
            v-model='model.name',
            :disabled='canEditGeneralFields',
            label='Клиент'
          )
        v-col(
          cols='12',
          md='4',
          lg='4'
        )
          a-select(
            v-model='model.clientType',
            :items='clientTypeSelect',
            :disabled='canEditGeneralFields',
            label='Тип клиента'
          )
      v-row
        v-col(
          cols='12',
          md='8',
          lg='8'
        )
          a-input(
            v-model='model.discount',
            :disabled='canEditGeneralFields',
            type='number',
            suffix='%',
            label='Скидка'
          )
        v-col(
          cols='12',
          md='4',
          lg='4'
        )
          a-switch.mt-1(
            v-model='model.isProvider',
            :disabled='canEditGeneralFields',
            label='Поставщик'
          )
      v-row
        v-col(
          cols='12',
          md='4',
          lg='4'
        )
          a-switch.mt-1(
            v-model='model.isConflict',
            :disabled='canEditGeneralFields',
            label='Конфликтный'
          )
        v-col(
          cols='12',
          md='4',
          lg='4'
        )
          a-switch.mt-1(
            v-model='model.allowedEmailNotifications',
            :disabled='canEditGeneralFields',
            label='E-mail'
          )
        v-col(
          cols='12',
          md='4',
          lg='4'
        )
          a-switch.mt-1(
            v-model='model.allowedNotifications',
            :disabled='canEditGeneralFields',
            label='SMS'
          )
    v-col.fields-section__phone(
      cols='12',
      md='4',
      lg='4'
    )
      v-row
        v-col.fields-section__phone-text(cols='12')
          span Телефонные номера
          v-menu(
            v-model='phoneMenu',
            :nudge-width='200',
            :close-on-content-click='false',
            offset-x
          )
            template(v-slot:activator='{ on, attrs }')
              v-btn(
                v-on='on',
                v-bind='attrs',
                :disabled='!$can("addPhone", "Client")',
                icon,
                color='primary'
              )
                v-icon mdi-plus
            v-card
              v-card-text
                a-input.mb-2(
                  v-model='phone.phone',
                  phone,
                  label='Телефон',
                  icon='mdi-phone',
                  hide-details,
                  dense
                )
                a-input(
                  v-model='phone.comment',
                  label='Комментарий',
                  icon='mdi-message',
                  hide-details,
                  dense
                )
              v-card-actions.softgrey
                v-spacer
                v-btn(
                  @click='phoneMenu = false',
                  text,
                  color='error'
                ) Отмена
                v-btn(
                  @click='updatePhone',
                  text,
                  color='primary'
                ) Добавить

      v-row
        v-col.fields-section__phone-numbers(cols='12')
          v-slide-x-transition(group)
            .fields-section__phone-numbers__item(
              v-for='phone in model.phone',
              v-if='phone.id',
              :key='phone.id'
            )
              span {{ phone.phone | VMask("+7 (###) ###-##-##") }}
              v-btn(
                :disabled='!$can("deletePhone", "Client")',
                @click='deletePhone(phone.id)',
                icon,
                color='error'
              )
                v-icon mdi-delete
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Client } from '@/typings/api/client'
import { filter, cloneDeep, last, map } from 'lodash'

@Component
export default class OClientModalFields extends Vue {
  @Prop(Object) client!: Client

  public phoneMenu = false
  public phone = {
    comment: '',
    phone: '',
    id: 1,
  }

  public clientTypeSelect = ['физ. лицо', 'компания']

  get canEditGeneralFields() {
    return !this.$can('edit', 'Client')
  }

  get model() {
    return this.client
  }

  updatePhone() {
    if (!this.phone.comment) {
      this.$notification.error('Заполните комментарий к номеру')
      return
    }

    if (!this.phone.phone) {
      this.$notification.error('Заполните номер телефона')
      return
    }

    const phone = cloneDeep(this.phone)

    let id
    if (this.model.phone.length > 0) {
      const lastPhone = last(this.model.phone)
      if (lastPhone) {
        id = lastPhone.id + 1
      } else {
        id = 1
      }
    } else {
      id = 1
    }

    phone.id = id

    this.model.phone.push(phone)

    this.phoneMenu = false
    this.phone.comment = ''
    this.phone.phone = ''
    this.phone.id = 1
  }

  deletePhone(id: number) {
    let phones = filter(this.model.phone, (e) => e.id !== id)
    phones = map(phones, (e, i) => ({
      id: i + 1,
      phone: e.phone,
      comment: e.comment,
    }))

    this.model.phone = phones
  }
}
</script>

<style lang="sass">
.client-modal-fields
  .fields-section
    &__phone
      &-text
        display: flex
        justify-content: space-between
        align-items: center
        padding: 12px
        font-size: 1.3rem
      &-numbers
        padding: 12px
        margin-top: -20px
        &__item
          display: flex
          justify-content: space-between
          align-items: center
</style>

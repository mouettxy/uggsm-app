<template lang="pug">
.ug-client-modal-content.pa-4
  v-slide-y-transition
    v-row(v-if='!isClientLoading && model')
      v-col(
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
            ug-base-input(
              v-model='model.name',
              :disabled='canEditGeneralFields',
              label='Клиент'
            )
          v-col(
            cols='12',
            md='4',
            lg='4'
          )
            ug-base-select(
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
            ug-base-input(
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
            ug-base-switch.mt-1(
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
            ug-base-switch.mt-1(
              v-model='model.isConflict',
              :disabled='canEditGeneralFields',
              label='Конфликтный'
            )
          v-col(
            cols='12',
            md='4',
            lg='4'
          )
            ug-base-switch.mt-1(
              v-model='model.allowedEmailNotifications',
              :disabled='canEditGeneralFields',
              label='E-mail'
            )
          v-col(
            cols='12',
            md='4',
            lg='4'
          )
            ug-base-switch.mt-1(
              v-model='model.allowedNotifications',
              :disabled='canEditGeneralFields',
              label='SMS'
            )
      v-col(
        cols='12',
        md='4',
        lg='4'
      )
        v-row
          v-col.d-flex.align-center.justify-space-between(cols='12')
            span Телефонные номера
            v-menu(
              v-model='phoneMenu',
              :nudge-width='200',
              :close-on-content-click='false',
              offset-x
            )
              template(v-slot:activator='{ on, attrs }')
                ug-base-btn(
                  v-on='on',
                  v-bind='attrs',
                  :disabled='!$can("addClientPhone", "Global")',
                  icon='mdi-plus',
                  color='primary'
                )
              v-card
                v-card-text
                  v-form(@submit.prevent='handlePhoneUpdate')
                    v-row
                      v-col(cols='12')
                        ug-base-input(
                          v-model='phone.phone',
                          phone,
                          label='Телефон',
                          icon='mdi-phone',
                          hide-details,
                          dense
                        )
                      v-col(cols='12')
                        ug-base-input(
                          v-model='phone.comment',
                          label='Комментарий',
                          icon='mdi-message',
                          hide-details,
                          dense
                        )
                v-card-actions.softgrey
                  v-spacer
                  ug-base-btn(
                    @click='phoneMenu = false',
                    text,
                    label='Отмена',
                    color='error'
                  )
                  ug-base-btn(
                    @click='handlePhoneUpdate',
                    type='submit',
                    text,
                    label='Добавить',
                    color='primary'
                  ) 

        v-row
          v-col(cols='12')
            v-slide-x-transition(group)
              .d-flex.align-center.justify-space-between(
                v-for='phone in model.phone',
                v-if='phone.id',
                :key='phone.id'
              )
                span {{ phone.phone | VMask("+7 (###) ###-##-##") }}
                ug-base-btn(
                  :disabled='!$can("deleteClientPhone", "Global")',
                  @click='handlePhoneDelete(phone.id)',
                  icon='mdi-delete',
                  color='error'
                )
  v-slide-y-reverse-transition
    .ug-modal-client-content__loader.d-flex.justify-center.align-center.h-100(v-if='isClientLoading || !client')
      v-progress-circular(
        size='128',
        indeterminate,
        color='primary'
      )
</template>

<script>
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'
import UgBaseSwitch from '@/components/base/ui/base-switch/base-switch.vue'
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import { cloneDeep, last } from 'lodash'

export default {
  name: 'ug-modal-client-content',

  components: {
    UgBaseSelect,
    UgBaseSwitch,
    UgBaseInput,
    UgBaseBtn,
  },

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

  data: function () {
    return {
      phoneMenu: false,
      phone: {
        comment: '',
        phone: '',
        id: 1,
      },

      clientTypeSelect: ['физ. лицо', 'компания'],
    }
  },

  computed: {
    canEditGeneralFields() {
      return !this.$can('editClient', 'Global')
    },

    model() {
      return this.client
    },
  },

  methods: {
    rewindPhoneModel() {
      this.phoneMenu = false
      this.phone.comment = ''
      this.phone.phone = ''
      this.phone.id = 1
    },

    handlePhoneUpdate() {
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

      this.rewindPhoneModel()
    },

    handlePhoneDelete(id) {
      let phones = this.model.phone.filter((e) => e.id !== id)

      phones = phones.map((e, i) => ({
        id: i + 1,
        phone: e.phone,
        comment: e.comment,
      }))

      this.model.phone = phones
    },
  },
}
</script>

<style lang="sass">
.ug-client-modal-content
  // 100vh - footerHeight - headerHeight
  height: calc(100vh - 48px - 60px)
  overflow-y: scroll
</style>

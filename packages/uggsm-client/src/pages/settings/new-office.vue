<route>
{
  "name": "settingsNewOffice",
  "meta": {
    "header": "Новый офис"
  }
}
</route>

<template lang="pug">
.page-settings-new-office
  v-card.pa-8
    v-card-title Новый офис
    v-card-text
      v-form.office-form(
        ref='form',
        v-model='isFormValid',
        @submit.prevent='handleOfficeCreate'
      )
        v-row
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='office.name',
              :rules='requiredField',
              label='Название',
              icon='mdi-account'
            )
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='office.code',
              :rules='requiredField',
              label='Код',
              icon='mdi-account'
            )
        v-row
          v-col(cols='12')
            ug-base-input(
              v-model.trim='office.address',
              :rules='requiredField',
              label='Адрес',
              icon='mdi-account'
            )
        v-row
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='office.ordersTemplate',
              :rules='requiredField',
              label='Шаблон ID заявок',
              icon='mdi-account',
              hint='Например ```4{C:4}```'
            )
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='office.docsTemplate',
              :rules='requiredField',
              label='Шаблон ID документа',
              icon='mdi-account',
              hint='Например ```BA{C:4}``` (Пока нигде не используется)'
            )
        v-row
          v-col(cols='12')
            ug-base-btn(
              type='submit',
              label='Создать',
              color='primary',
              block
            )
</template>

<script>
import OfficeAPI from '@/api/office'

export default {
  layout: 'centered',

  name: 'ug-settings-new-office',

  data: function () {
    return {
      isFormValid: false,
      requiredField: [(v) => !!v || 'Необходимое поле'],
      office: {
        code: '',
        name: '',
        address: '',
        ordersTemplate: '',
        docsTemplate: '',
      },
    }
  },

  methods: {
    rewindOffice() {
      this.office = {
        code: '',
        name: '',
        address: '',
        ordersTemplate: '',
        docsTemplate: '',
      }
    },

    async createOffice() {
      const response = await OfficeAPI.create(this.office)

      if (response.status !== 200) {
        return false
      }

      return true
    },

    async handleOfficeCreate() {
      const { form } = this.$refs

      const isFormValid = form.validate()

      if (isFormValid) {
        const isOfficeCreated = await this.createOffice()

        if (isOfficeCreated) {
          this.$notification.success('Офис успешно добавлен')
          this.rewindOffice()
        } else {
          this.$notification.error('Ошибка при добавлении офиса')
        }
      }
    },
  },
}
</script>

<style lang="sass">
.page-settings-new-office
  margin: 0 auto
</style>

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
              :single-line='false',
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
              :single-line='false',
              :rules='requiredField',
              label='Код',
              icon='mdi-account'
            )
        v-row
          v-col(cols='12')
            ug-base-input(
              v-model.trim='office.address',
              :single-line='false',
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
              :single-line='false',
              :rules='[...requiredField, ...officeTemplateCheck]',
              @input='handleOrdersTemplateInput',
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
              :single-line='false',
              :rules='requiredField',
              label='Шаблон ID документа',
              icon='mdi-account',
              hint='Например ```BA{C:4}``` (Пока нигде не используется)'
            )
        v-slide-y-transition
          v-row(v-if='officeState')
            v-col(cols='12')
              .ug-markdown-content(v-md) {{ officeState }}
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
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseInput from '@/components/base/ui/base-input/base-input'

const ORDER_TEMPLATE_REGEX = /(\d*)\{(C):(\d)\}/g

export default {
  name: 'ug-settings-new-office',

  components: {
    UgBaseBtn,
    UgBaseInput,
  },

  layout: 'centered',

  data: function () {
    return {
      isFormValid: false,
      requiredField: [(v) => !!v || 'Необходимое поле'],
      officeTemplateCheck: [
        (v) => ORDER_TEMPLATE_REGEX.test(v) || 'Неверно заполнено поле. Примеры правильных шаблонов 4{C:4} 18{C:2}',
      ],

      officeState: '',
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

    handleOrdersTemplateInput() {
      const isCorrect = ORDER_TEMPLATE_REGEX.test(this.office.ordersTemplate)

      if (!isCorrect) {
        this.officeState =
          'Некорректное заполнение поля "Шаблон ID заявок".\n- Проверьте корректность цифры перед фигурными скобками **4**{C:*4*}\n- Проверьте что первый аргумент фигурных скобок буква C в английском регистре 4{**C**:4}\n- Проверьте что второй аргумент внутри фигурных скобок положительное число 4{C:**4**}'
        return
      }

      this.officeState = ''
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

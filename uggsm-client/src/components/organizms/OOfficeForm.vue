<template lang="pug">
v-form.office-form(
  ref='form',
  v-model='valid',
  @submit.prevent='onOffice'
)
  a-input(
    v-model.trim='office.code',
    :validate='requiredField',
    label='Код (Уникальный)',
    icon='mdi-account',
    dense
  )
  a-input(
    v-model.trim='office.name',
    :validate='requiredField',
    label='Название',
    icon='mdi-account',
    dense
  )
  a-input(
    v-model.trim='office.address',
    :validate='requiredField',
    label='Адрес',
    icon='mdi-account',
    dense
  )
  a-input(
    v-model.trim='office.ordersTemplate',
    :validate='requiredField',
    label='Шаблон ID заявок',
    icon='mdi-account',
    dense,
    hint='Например 4{C:4}'
  )
  a-input(
    v-model.trim='office.docsTemplate',
    :validate='requiredField',
    label='Шаблон ID документа',
    icon='mdi-account',
    dense,
    hint='Например BA{C:4} (Пока нигде не используется)'
  )
  a-input.mt-6(
    v-model.trim='office.masterPwd',
    :validate='requiredField',
    label='Мастер пароль',
    icon='mdi-lock-alert',
    dense
  )
  v-btn(
    type='submit',
    color='primary'
  ) Создать
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

import { officeAPI } from '@/api'

@Component
export default class OOfficeForm extends Vue {
  @Ref('form') form: any
  public valid = false
  public requiredField: Array<any> = [(v: string) => !!v || 'Необходимое поле']
  public office: any = {
    code: '',
    name: '',
    address: '',
    ordersTemplate: '',
    docsTemplate: '',
    masterPwd: '',
  }

  async onOffice() {
    if (this.form.validate()) {
      if (await officeAPI(this.office.code).create(this.office)) {
        this.$notification.success('Офис успешно добавлен')
        this.office = {
          code: '',
          name: '',
          address: '',
          ordersTemplate: '',
          docsTemplate: '',
          masterPwd: this.office.masterPwd,
        }
      } else {
        this.$notification.error('Упс... Что-то пошло не так')
      }
    }
  }
}
</script>

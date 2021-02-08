<template lang="pug">
v-form.office-form(
  ref='form',
  v-model='valid',
  @submit.prevent='onOffice'
)
  v-row
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      a-input(
        v-model.trim='office.name',
        :validate='requiredField',
        :hide-details='false',
        label='Название',
        icon='mdi-account',
        dense
      )
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      a-input(
        v-model.trim='office.code',
        :validate='requiredField',
        :hide-details='false',
        label='Код',
        icon='mdi-account',
        dense
      )
  v-row
    v-col(cols='12')
      a-input(
        v-model.trim='office.address',
        :validate='requiredField',
        :hide-details='false',
        label='Адрес',
        icon='mdi-account',
        dense
      )
  v-row
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      a-input(
        v-model.trim='office.ordersTemplate',
        :validate='requiredField',
        :hide-details='false',
        label='Шаблон ID заявок',
        icon='mdi-account',
        dense,
        hint='Например 4{C:4}'
      )
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      a-input(
        v-model.trim='office.docsTemplate',
        :validate='requiredField',
        :hide-details='false',
        label='Шаблон ID документа',
        icon='mdi-account',
        dense,
        hint='Например BA{C:4} (Пока нигде не используется)'
      )
  v-row
    v-col(cols='12')
      v-btn(
        type='submit',
        color='primary',
        block
      ) Создать офис
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

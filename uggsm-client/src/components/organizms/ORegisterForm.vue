<template lang="pug">
v-form.register-form(
  ref='form',
  v-model='valid',
  @submit.prevent='onRegister'
)
  a-input(
    v-model.trim='user.username',
    :validate='usernameRules',
    label='Логин',
    icon='mdi-account',
    dense
  )
  a-input(
    v-model.trim='user.password',
    :validate='passwordRules',
    type='password',
    label='Пароль',
    icon='mdi-lock',
    dense
  )
  a-input(
    v-model.trim='user.credentials',
    :validate='credentialsRules',
    type='text',
    label='Имя (Для отображения)',
    icon='mdi-rename-box',
    dense
  )
  a-select(
    v-model.trim='user.role',
    :items='["Администратор", "Мастер", "Менеджер"]',
    label='Роль пользователя в системе',
    icon='mdi-account-hard-hat',
    dense
  )
  m-office-switcher(
    v-model='user.office',
    :items='offices'
  )
  a-input.mt-6(
    v-model.trim='user.masterPwd',
    :validate='masterPwdRules',
    label='Мастер пароль',
    icon='mdi-lock-alert',
    dense
  )
  v-btn(
    type='submit',
    color='primary'
  ) Регистрация
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

import { AuthInput } from '@/typings/api/auth'
import { authModule, officesModule } from '@/store'
import { map, cloneDeep } from 'lodash'

@Component
export default class ORegisterForm extends Vue {
  @Ref('form') form: any
  public valid = false
  public usernameRules: Array<Function> = [(v: string) => !!v || 'Заполните логин для успешной регистрации']
  public passwordRules: Array<Function> = [(v: string) => !!v || 'Заполните пароль для успешной регистрации']
  public credentialsRules: Array<Function> = [(v: string) => !!v || 'Заполните имя для успешной регистрации']
  public masterPwdRules: Array<Function> = [(v: string) => !!v || 'Заполните мастер пароль для успешной регистрации']
  public user: any = {
    username: '',
    password: '',
    credentials: '',
    office: '',
    role: '',
    masterPwd: '',
  }

  get offices() {
    return map(officesModule.offices, (el) => `${el.code}|${el.name}`)
  }

  async onRegister() {
    if (this.form.validate()) {
      if (!this.user.office) {
        this.$notification.error('Закрепите за пользователем офис')
        return false
      }
      if (!this.user.role) {
        this.$notification.error('Дайте пользователю роль')
        return false
      }

      const copy = cloneDeep(this.user)

      const userOffice = this.user.office.split('|')[0]
      let userRole
      if (this.user.role === 'Администратор') {
        userRole = 'administrator'
      } else if (this.user.role === 'Менеджер') {
        userRole = 'manager'
      } else if (this.user.role === 'Мастер') {
        userRole = 'master'
      } else {
        userRole = 'master'
      }

      if (userOffice && userRole) {
        copy.role = userRole
        copy.office = userOffice

        if (await authModule.register(copy)) {
          this.$notification.success('Пользователь успешно зарегистрирован')
          this.user = {
            username: '',
            password: '',
            credentials: '',
            office: '',
            role: '',
            masterPwd: this.user.masterPwd,
          }
        } else {
          this.$notification.error('Упс... Что-то пошло не так')
        }
      }
    }
  }
}
</script>

<template lang="pug">
v-form.login-form(ref='form', v-model='valid', @submit.prevent='onLogin')
  a-input(v-model='user.username', icon='mdi-account', label='Логин', :validate='usernameRules')
  a-input(v-model='user.password', icon='mdi-lock', label='Пароль', type='password', :validate='passwordRules')
  v-btn(color='primary', type='submit') Войти
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'

import AInput from '@/components/atoms/AInput.vue'
import { AuthInput } from '@/typings/api/auth'
import { authModule } from '@/store'

@Component({
  components: {
    AInput
  }
})
export default class OLoginForm extends Vue {
  @Ref('form') form: any
  public valid = false
  public usernameRules: Array<Function> = [(v: string) => !!v || 'Заполните логин для входа']
  public passwordRules: Array<Function> = [(v: string) => !!v || 'Заполните пароль для входа']
  public user: AuthInput = {
    username: '',
    password: ''
  }

  async onLogin() {
    if (this.form.validate()) {
      if (await authModule.login(this.user)) {
        this.$notification.success('Успешная авторизация')
        this.$router.push({ name: 'orders' })
      } else {
        this.$notification.error('Неверные логин или пароль')
      }
    }
  }
}
</script>

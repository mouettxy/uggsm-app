<template lang="pug">
v-form.login-form(
  ref='form',
  v-model='valid',
  @submit.prevent='onLogin'
)
  ug-base-input.mb-1(
    v-model='user.username',
    :rules='usernameRules',
    label='Логин',
    icon='mdi-account'
  )
  ug-base-input.mb-1(
    v-model='user.password',
    :rules='passwordRules',
    type='password',
    label='Пароль',
    icon='mdi-lock'
  )
  v-btn(
    type='submit',
    color='primary'
  ) Войти
</template>

<script lang="ts">
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

import { Component, Vue, Ref } from 'vue-property-decorator'

import { AuthInput } from '@/typings/api/auth'
import { authModule } from '@/store'

@Component({
  components: {
    UgBaseInput,
  },
})
export default class OLoginForm extends Vue {
  @Ref('form') form: any
  public valid = false
  public usernameRules: Array<any> = [(v: string) => !!v || 'Заполните логин для входа']
  public passwordRules: Array<any> = [(v: string) => !!v || 'Заполните пароль для входа']
  public user: AuthInput = {
    username: '',
    password: '',
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

<route>
{
  "name": "login",
  "meta": {
    "header": "Авторизация"
  }
}
</route>

<template lang="pug">
.page-login
  v-card.pa-8
    v-card-title Авторизация
    v-card-text
      v-form.ug-login-form(
        ref='form',
        v-model='isFormValid',
        @submit.prevent.stop='handleLogin'
      )
        v-row
          v-col(cols='12')
            ug-base-input.mb-1(
              v-model='user.username',
              :rules='usernameRules',
              label='Логин',
              icon='mdi-account'
            )
        v-row
          v-col(cols='12')
            ug-base-input.mb-1(
              v-model='user.password',
              :rules='passwordRules',
              type='password',
              label='Пароль',
              icon='mdi-lock'
            )
        v-row
          v-col.text-right(cols='12')
            ug-base-btn(
              type='submit',
              label='Войти',
              color='primary'
            )
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import { mapActions } from 'vuex'

export default {
  name: 'ug-page-login',

  components: {
    UgBaseInput,
    UgBaseBtn,
  },

  layout: 'centered',

  data: function () {
    return {
      isFormValid: false,
      usernameRules: [(v) => !!v || 'Заполните логин для входа'],
      passwordRules: [(v) => !!v || 'Заполните пароль для входа'],
      user: {
        username: '',
        password: '',
      },
    }
  },

  methods: {
    ...mapActions({
      loginUser: 'auth/login',
    }),

    async handleLogin() {
      const { form } = this.$refs

      const isFormValid = form.validate()

      if (isFormValid) {
        const isLoggedIn = await this.loginUser(this.user)

        if (!isLoggedIn) {
          this.$notification.error('Неверные логин или пароль')
          return
        }

        this.$notification.success('Успешная авторизация')
        this.$router.push({ name: 'orders' })
      }
    },
  },
}
</script>

<style lang="sass">
.page-login
  margin: 0 auto
</style>

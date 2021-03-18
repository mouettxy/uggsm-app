<route>
{
  "name": "login",
  "meta": {
    "header": "Авторизация"
  }
}
</route>

<template>
  <div class="ug-page-login">
    <v-card class="pa-8">
      <v-card-title>Авторизация</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" class="ug-login-form" @submit.prevent.stop="handleLogin">
          <v-row>
            <v-col cols="12">
              <ug-base-input
                v-model="user.username"
                class="mb-1"
                icon="mdi-account"
                label="Логин"
                :rules="usernameRules"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ug-base-input
                v-model="user.password"
                class="mb-1"
                icon="mdi-lock"
                label="Пароль"
                :rules="passwordRules"
                type="password"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="text-right" cols="12">
              <ug-base-btn color="primary" label="Войти" type="submit"></ug-base-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
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
.ug-page-login
  margin: 0 auto
</style>

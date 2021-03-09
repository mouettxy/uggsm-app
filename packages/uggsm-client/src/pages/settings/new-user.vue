<route>
{
  "name": "settingsNewUser",
  "meta": {
    "header": "Регистрация пользователя"
  }
}
</route>

<template lang="pug">
.page-settings-new-user
  v-card.pa-8
    v-card-title Новый пользователь
    v-card-text
      v-form(
        ref='form',
        v-model='isFormValid',
        @submit.prevent='handleUserRegister'
      )
        v-row
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='user.username',
              :rules='requiredField',
              label='Логин',
              icon='mdi-account'
            )
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='user.password',
              :rules='requiredField',
              type='password',
              label='Пароль',
              icon='mdi-lock'
            )
        v-row
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-input(
              v-model.trim='user.credentials',
              :rules='requiredField',
              label='Имя',
              icon='mdi-rename-box'
            )
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-select(
              v-model.trim='user.role',
              :items='roles',
              :hide-details='false',
              label='Роль',
              icon='mdi-account-hard-hat',
              dense
            )
              template(#selection='{item}')
                span {{ item.text }}
        v-row
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-select.mb-1(
              v-model='user.office',
              :items='offices',
              label='Офис'
            )
          v-col(
            cols='12',
            md='6',
            lg='6'
          )
            ug-base-btn(
              type='submit',
              label='Создать',
              color='primary',
              block
            )
</template>

<script>
import UgBaseSelect from '@/components/base/ui/base-select/base-select'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import RoleAPI from '@/api/role'
import OfficeAPI from '@/api/office'
import AuthAPI from '@/api/auth'

export default {
  name: 'ug-page-settings-new-user',

  components: {
    UgBaseSelect,
    UgBaseInput,
    UgBaseBtn,
  },

  layout: 'centered',

  data: function () {
    return {
      user: {
        username: '',
        password: '',
        credentials: '',
        office: '',
        role: '',
      },

      officesRaw: [],
      rolesRaw: [],
      isFormValid: false,

      requiredField: [(v) => !!v || 'Необходимое поле'],
    }
  },

  computed: {
    roles() {
      if (!this.officesRaw) {
        return []
      }

      return this.rolesRaw.map((e) => ({
        text: e.name,
        value: e.value,
      }))
    },

    offices() {
      if (!this.officesRaw) {
        return []
      }

      return this.officesRaw.map((e) => ({
        text: `${e.code}|${e.name}`,
        value: `${e.code}|${e.name}`,
      }))
    },
  },

  mounted: function () {
    this.fetchOffices()
    this.fetchRoles()
  },

  methods: {
    async fetchOffices() {
      const response = await OfficeAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error('Ошибка при получении списка офисов')
        return
      }

      this.officesRaw = response.data
    },

    async fetchRoles() {
      const response = await RoleAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error('Ошибка при получении списка ролей')
        return
      }

      this.rolesRaw = response.data
    },

    rewindForm() {
      this.user = {
        username: '',
        password: '',
        credentials: '',
        office: '',
        role: '',
      }

      this.isFormValid = true
    },

    async registerUser(userData) {
      const response = await AuthAPI.register(userData)

      if (response.status !== 200) {
        return false
      }

      return true
    },

    async handleUserRegister() {
      const { form } = this.$refs

      const isFormValid = form.validate()
      const isOfficeValid = this.user.office
      const isRoleValid = this.user.role

      if (isFormValid) {
        if (!isOfficeValid) {
          this.$notification.error('Закрепите за пользователем офис')
          return
        }

        if (!isRoleValid) {
          this.$notification.error('Выдайте пользователю роль')
          return
        }

        const user = Object.assign({}, this.user)

        const userOffice = this.user.office.split('|')[0]

        if (userOffice) {
          user.office = userOffice

          const isUserRegistered = await this.registerUser(user)

          if (isUserRegistered) {
            this.$notification.success('Пользователь успешно зарегистрирован')
            this.rewindForm()
          } else {
            this.$notification.error('Ошибка при регистрации пользователя')
          }
        }
      }
    },
  },
}
</script>

<style lang="sass">
.page-settings-new-user
  margin: 0 auto
</style>

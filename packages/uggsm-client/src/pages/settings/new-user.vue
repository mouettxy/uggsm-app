<route>
{
  "name": "settingsNewUser",
  "meta": {
    "header": "Регистрация пользователя"
  }
}
</route>

<template>
  <div class="page-settings-new-user">
    <v-card class="pa-8">
      <v-card-title>Новый пользователь</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="handleUserRegister">
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="user.username"
                icon="mdi-account"
                label="Логин"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="user.password"
                icon="mdi-lock"
                label="Пароль"
                :rules="requiredField"
                type="password"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="user.credentials"
                icon="mdi-rename-box"
                label="Имя"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-select
                v-model.trim="user.role"
                dense
                :hide-details="false"
                icon="mdi-account-hard-hat"
                :items="roles"
                label="Роль"
              >
                <template #selection="{ item }">
                  <span>{{ item.text }}</span>
                </template>
              </ug-base-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <ug-base-select v-model="user.office" class="mb-1" :items="offices" label="Офис"></ug-base-select>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-btn block color="primary" label="Создать" type="submit"></ug-base-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
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

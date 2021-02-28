<template lang="pug">
v-form.register-form(
  ref='form',
  v-model='valid',
  @submit.prevent='onRegister'
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
      m-office-switcher.mb-1(
        v-model='user.office',
        :items='offices',
        :hide-details='false'
      )
    v-col(
      cols='12',
      md='6',
      lg='6'
    )
      v-btn(
        type='submit',
        color='primary',
        block
      ) Регистрация
</template>

<script lang="ts">
import UgBaseSelect from '@/components/base/ui/base-select/base-select.vue'
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

import { Component, Vue, Ref } from 'vue-property-decorator'
import { authModule, officesModule } from '@/store'
import { map, cloneDeep } from 'lodash'
import RoleAPI from '@/api/role'

@Component({
  components: {
    UgBaseSelect,
    UgBaseInput,
  },
})
export default class ORegisterForm extends Vue {
  @Ref('form') form: any
  public valid = false
  public requiredField: Array<any> = [(v: string) => !!v || 'Необходимое поле']

  public roles: { text: string; value: string }[] = []

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

      if (userOffice) {
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

  async mounted() {
    officesModule.fetch()

    const roles = await RoleAPI.getAll()

    this.roles = map(roles.data, (e) => ({
      text: e.description,
      value: e.name,
    }))
  }
}
</script>

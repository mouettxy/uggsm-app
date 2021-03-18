<route>
{
  "name": "settingsNewOffice",
  "meta": {
    "header": "Новый офис"
  }
}
</route>

<template>
  <div class="page-settings-new-office">
    <v-card class="pa-8">
      <v-card-title>Новый офис</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" class="office-form" @submit.prevent="handleOfficeCreate">
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="office.name"
                icon="mdi-account"
                label="Название"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="office.code"
                icon="mdi-account"
                label="Код"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ug-base-input
                v-model.trim="office.address"
                icon="mdi-account"
                label="Адрес"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="office.ordersTemplate"
                hint="Например ```4{C:4}```"
                icon="mdi-account"
                label="Шаблон ID заявок"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model.trim="office.docsTemplate"
                hint="Например ```BA{C:4}``` (Пока нигде не используется)"
                icon="mdi-account"
                label="Шаблон ID документа"
                :rules="requiredField"
              ></ug-base-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <ug-base-btn block color="primary" label="Создать" type="submit"></ug-base-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import OfficeAPI from '@/api/office'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

export default {
  name: 'ug-settings-new-office',

  components: {
    UgBaseInput,
    UgBaseBtn,
  },

  layout: 'centered',

  data: function () {
    return {
      isFormValid: false,
      requiredField: [(v) => !!v || 'Необходимое поле'],
      office: {
        code: '',
        name: '',
        address: '',
        ordersTemplate: '',
        docsTemplate: '',
      },
    }
  },

  methods: {
    rewindOffice() {
      this.office = {
        code: '',
        name: '',
        address: '',
        ordersTemplate: '',
        docsTemplate: '',
      }
    },

    async createOffice() {
      const response = await OfficeAPI.create(this.office)

      if (response.status !== 200) {
        return false
      }

      return true
    },

    async handleOfficeCreate() {
      const { form } = this.$refs

      const isFormValid = form.validate()

      if (isFormValid) {
        const isOfficeCreated = await this.createOffice()

        if (isOfficeCreated) {
          this.$notification.success('Офис успешно добавлен')
          this.rewindOffice()
        } else {
          this.$notification.error('Ошибка при добавлении офиса')
        }
      }
    },
  },
}
</script>

<style lang="sass">
.page-settings-new-office
  margin: 0 auto
</style>

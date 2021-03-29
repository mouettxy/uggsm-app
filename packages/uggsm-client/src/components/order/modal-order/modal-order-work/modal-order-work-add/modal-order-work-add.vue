<template>
  <ug-modal-center v-model="addWorkModal" content-class="ug-modal-order-work-add" eager>
    <template #activator="{ on, attrs }">
      <ug-base-btn
        v-if="!isOrderClosed && $can('addOrderWork', 'Global')"
        v-bind="attrs"
        color="success"
        label="Добавить работу"
        icon-left="mdi-plus"
        v-on="on"
      ></ug-base-btn>
    </template>
    <ug-modal-content>
      <template #header>
        <div class="d-flex justify-space-between align-center w-100">
          <h5 class="text-h5">Добавление работы</h5>
          <ug-base-btn icon="mdi-close" @click="handleClose"></ug-base-btn>
        </div>
      </template>
      <template #main>
        <v-form ref="form" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <ug-base-autocomplete
                v-model="workModel.header"
                :hide-details="true"
                label="Название работы"
                icon="mdi-hammer-screwdriver"
                endpoint="/completed-work"
              ></ug-base-autocomplete>
            </v-col>
            <v-col cols="12">
              <ug-base-textarea v-model="workModel.message" label="Описание работы"></ug-base-textarea>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-input
                v-model="workModel.price"
                :hide-details="true"
                :rules="[(v) => v > 0 || 'Введите число без лишних знаков']"
                type="number"
                label="Цена работы"
              ></ug-base-input>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <ug-base-autocomplete
                v-model="workModel.user"
                :uri-query="{ m: 'Order', f: 'master.credentials', v: 'master.id' }"
                :predefined-items="[workModel.user]"
                return-object
                :hide-details="true"
                label="Исполнитель работы"
                icon="mdi-account-hard-hat"
                endpoint="/custom"
              ></ug-base-autocomplete>
            </v-col>
          </v-row>
        </v-form>
      </template>
      <template #footer>
        <ug-base-btn icon-left="mdi-content-save" color="primary" label="Добавить" @click="handleSubmit"></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" @click="handleClose"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-center>
</template>

<script>
import UgModalCenter from '@/components/base/ui/modal-center/modal-center'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseTextarea from '@/components/base/ui/base-textarea/base-textarea'
import UgBaseAutocomplete from '@/components/base/ui/base-autocomplete/base-autocomplete'
import UgBaseInput from '@/components/base/ui/base-input/base-input'

import OrderAPI from '@/api/order'
import { mapState } from 'vuex'

export default {
  name: 'ug-modal-order-work-add',

  components: {
    UgModalCenter,
    UgModalContent,
    UgBaseBtn,
    UgBaseTextarea,
    UgBaseAutocomplete,
    UgBaseInput,
  },

  props: {
    order: {
      required: false,
      type: Object,
      default: () => ({}),
    },

    isOrderClosed: {
      required: false,
      type: Boolean,
    },
  },

  data: () => ({
    addWorkModal: false,
    workModel: {
      header: '',
      message: '',
      credentials: '',
      price: 1000,
      userid: null,
      createdBy: null,
      user: {
        text: '',
        value: '',
      },
    },
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  created() {
    this.workModel.user = {
      text: this.order.master?.credentials || '',
      value: this.order.master?.id || '',
    }
  },

  methods: {
    rewindModal() {
      this.addWorkModal = false

      this.workModel = {
        header: '',
        message: '',
        credentials: '',
        price: 1000,
        userid: null,
        createdBy: null,
        user: {
          text: this.order.master?.credentials || '',
          value: this.order.master?.id || '',
        },
      }
    },

    async handleSubmit() {
      const { form } = this.$refs
      const request = {
        ...this.workModel,
        createdBy: this.user.id,
      }
      if (!request.user) {
        request.user = {
          text: this.order.master?.credentials || '',
          value: this.order.master?.id || '',
        }
      }

      request.userid = request.user.value
      request.credentials = request.user.text

      delete request.user

      if (form.validate() && request.userid) {
        const response = await OrderAPI.addCompletedWork(this.order.id, request)

        if (response.status !== 200) {
          this.$notification.error('Не удалось создать работу')
          return
        }

        this.$notification.success('Работа успешно создана')
        this.rewindModal()
      }
    },

    handleClose() {
      this.rewindModal()
    },
  },
}
</script>

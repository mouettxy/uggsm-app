<template>
  <ug-modal-center v-model="modal">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content>
      <template #header>
        <h5 class="text-h5">Добавление комментария</h5>
      </template>
      <template #main>
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12">
              <ug-base-textarea v-model="comment" label="Комментарий к заявке"></ug-base-textarea>
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

import { mapState } from 'vuex'
import OrderAPI from '@/api/order'

export default {
  name: 'ug-order-add-comment',

  components: {
    UgModalContent,
    UgModalCenter,
    UgBaseBtn,
    UgBaseTextarea,
  },

  props: {
    orderId: {
      required: false,
      type: [String, Number],
      default: '',
    },
  },

  data: () => ({
    modal: false,
    comment: '',
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  methods: {
    rewindModal() {
      this.modal = false
      this.comment = ''
    },

    async handleSubmit() {
      if (!this.comment) {
        this.$notification.error('Заполните поле комментария')
        return
      }

      if (!this.orderId) {
        this.$notification.error('Не удалось получить ID заказа')
        return
      }

      const request = {
        message: this.comment,
        userid: this.user.id,
      }

      const response = await OrderAPI.addOrderComment(this.orderId, request)

      if (response.status !== 200) {
        this.$notification.error('Не удалось добавить комментарий')
        return
      }

      this.$notification.success('Комментарий успешно добавлен')
      this.rewindModal()
    },

    handleClose() {
      this.rewindModal()
    },
  },
}
</script>

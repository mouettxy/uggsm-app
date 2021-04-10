<template>
  <ug-modal-center v-model="modal">
    <template #activator="{ on, attrs }">
      <slot name="activator" :on="on" :attrs="attrs"></slot>
    </template>
    <ug-modal-content>
      <template #header>
        <h5 class="text-h5">Обратная связь</h5>
      </template>

      <template #main>
        <v-row>
          <v-col cols="12">
            <v-subheader>Сообщите об ошибке или оставьте предложение</v-subheader>
          </v-col>
          <v-col cols="12">
            <ug-base-input
              v-model="report.name"
              label="Ваше имя"
              :single-line="false"
              :hide-details="true"
              icon="mdi-account-tie"
            ></ug-base-input>
          </v-col>
          <v-col cols="12">
            <ug-base-textarea
              v-model="report.comments"
              label="Описание предложения или ошибки"
              placeholder="Я нажал на 'X' и случилось 'Y'"
              hide-details="auto"
              hint="Мы соберём дополнительную информацию со страницы такую как: история взаимодействия с интерфейсом, история переходов по сайту и информация о вашем устройстве"
              persistent-hint
              icon="mdi-comment-edit"
            ></ug-base-textarea>
          </v-col>
        </v-row>
      </template>

      <template #footer>
        <ug-base-btn
          icon-left="mdi-content-save"
          label="Отправить"
          color="primary"
          @click="handleSendClick"
        ></ug-base-btn>
        <ug-base-btn icon-left="mdi-close" label="Закрыть" outlined @click="handleCloseClick"></ug-base-btn>
      </template>
    </ug-modal-content>
  </ug-modal-center>
</template>

<script>
import UgModalCenter from '@/components/base/ui/modal-center/modal-center'
import UgModalContent from '@/components/base/ui/modal-content/modal-content'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import UgBaseTextarea from '@/components/base/ui/base-textarea/base-textarea'
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import { mapState } from 'vuex'
import { sendUserReport } from '@/plugins/sentry'

export default {
  name: 'ug-modal-user-feedback',

  components: {
    UgModalCenter,
    UgModalContent,
    UgBaseBtn,
    UgBaseTextarea,
    UgBaseInput,
  },

  data: () => ({
    modal: false,

    report: {
      name: '',
      email: 'placeholder@uggsm.ru',
      comments: '',
    },
  }),

  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
  },

  mounted() {
    this.report.name = this.user.credentials
    this.report.comments = ''
  },

  methods: {
    rewindModal() {
      this.modal = false

      this.report.name = this.user.credentials
      this.report.comments = ''
    },

    async handleSendClick() {
      if (!this.report.comments) {
        this.$notification.error('Заполните описание')
      }

      const isReportSended = await sendUserReport(this.report)

      if (!isReportSended) {
        this.$notification.error('Не удалось отправить сообщение')
        return
      }

      this.$notification.success('Сообщение успешно отправлено!')
      this.rewindModal()
    },

    handleCloseClick() {
      this.rewindModal()
    },
  },
}
</script>

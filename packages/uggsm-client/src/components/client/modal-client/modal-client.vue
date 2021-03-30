<template lang="pug">
.ug-client-modal
  ug-modal-right(
    v-model='modal',
    dont-disable-overflow
  )
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
        ug-base-btn(
          v-on='on',
          v-bind='attrs',
          :label='clientid',
          text,
          icon-left='mdi-pencil'
        )

    template(#content)
      .ug-client-modal__container
        .ug-client-modal__container--wrap
          ug-modal-client-header(
            :is-client-loading='isLoading',
            :client='client',
            @close='handleModalClose'
          )

          ug-modal-client-content(
            :is-client-loading='isLoading',
            :client='client'
          )

      v-footer.ug-client-modal__footer.px-2
        ug-base-btn(
          :disabled='!$can("editClient", "Global")',
          @click='updateClient',
          label='Обновить',
          icon-left='mdi-content-save-edit',
          color='primary'
        )
</template>

<script>
import UgModalClientHeader from './modal-client-header/modal-client-header'
import UgModalClientContent from './modal-client-content/modal-client-content'
import UgModalRight from '@/components/base/ui/modal-right/modal-right'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'
import Responsive from '@/mixins/responsive'

import ClientAPI from '@/api/client'

export default {
  name: 'ug-modal-client',

  components: {
    UgModalClientHeader,
    UgModalClientContent,
    UgModalRight,
    UgBaseBtn,
  },

  sockets: {
    ['updated client'](client) {
      if (client.id === this.client?.id && this.modal) {
        this.client = client
      }
    },
  },

  mixins: [Responsive],

  props: {
    clientid: {
      required: true,
      type: [Number, String],
    },

    dontDisableOverflow: {
      required: false,
      type: Boolean,
    },
  },

  data: function () {
    return {
      client: null,
      modal: false,
      isLoading: false,
    }
  },

  watch: {
    modal: async function (isModalActive) {
      if (isModalActive) {
        this.isLoading = true
        const response = await ClientAPI.getOne(this.clientid)

        if (response.status !== 200) {
          this.$notification.error('Не удалось получить клиента')
          this.modal = false
          return
        }

        this.client = response.data

        this.isLoading = false
      } else {
        this.client = null
      }
    },
  },

  methods: {
    rewindModel() {
      this.client = null
      this.modal = false
    },

    handleModalClose() {
      this.rewindModel()
    },

    async updateClient() {
      const response = await ClientAPI.update(this.client.id, this.client)

      if (response.status !== 200) {
        this.$notification.error('Ошибка при обновлении клиента')
        return
      }

      this.$notification.success('Клиент успешно обновлён')
      this.rewindModel()
    },
  },
}
</script>

<style lang="sass">
$height: calc(100vh - 50px)

.client-modal__container
  height: $height
  overflow: hidden
  .client-modal__container--wrap
    height: 100%
    padding: 0 !important
</style>

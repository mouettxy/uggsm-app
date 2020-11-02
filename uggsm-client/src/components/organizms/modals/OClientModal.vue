<template lang="pug">
.client-modal
  a-right-modal(v-model='modal')
    template(#activator='{on, attrs}')
      slot(
        name='activator',
        :on='on',
        :attrs='attrs'
      )
        v-btn(
          v-on='on',
          v-bind='attrs',
          text
        )
          v-icon(left) mdi-pencil
          span {{ clientid }}

    template(#content)
      .client-modal__container
        .order-modal__container-item(v-if='client')
          o-client-modal-content(:client='client')

      v-footer.client-modal__footer.elevation-8
        v-btn.mr-2(
          @click='update',
          color='primary'
        )
          v-icon(left) mdi-content-save-edit
          span Обновить
        template(v-if='screenWidth > 666')
          v-btn(
            @click='close',
            text
          )
            v-icon(left) mdi-close
            span Закрыть
        template(v-else)
          v-btn(
            @click='close',
            icon
          )
            v-icon mdi-close
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from 'vue-property-decorator'
import { Client } from '@/typings/api/client'
import { clientModule } from '@/store'
import { Socket } from 'vue-socket.io-extended'
import Responsive from '@/mixins/responive'

@Component
export default class OClientModal extends Mixins(Responsive) {
  @Prop({ type: [Number, String], required: true }) clientid!: number | string
  @Prop({ type: Boolean, default: false }) byName!: boolean
  public client: Client | null = null
  public modal = false

  @Watch('modal')
  async onModalStateChange(modal: boolean) {
    if (modal) {
      const client =
        this.byName && typeof this.clientid === 'string'
          ? await clientModule.getOneByName(this.clientid)
          : await clientModule.getOneById(this.clientid)
      if (client && typeof client !== 'boolean') {
        this.client = client
      }
    } else {
      this.client = null
    }
  }

  @Socket('updated client')
  onSocketUpdatedClient(model: Client) {
    if (model.id === this.client?.id && this.modal) {
      this.client = model
    }
  }

  close() {
    this.client = null
    this.modal = false
  }

  async update() {
    const response = await clientModule.updateById(this.client as Client)

    if (response) {
      this.$notification.success('Клиент успешно обновлён')
      this.client = null
      this.modal = false
    } else {
      this.$notification.error('Ошибка при обновлении клиента')
    }
  }
}
</script>

<style lang="sass">
$height: calc(100vh - 50px)
$height-payed: calc(100vh - 70px)

.client-modal__container
  height: $height
  overflow: hidden
  &--payed
    height: $height-payed
  .client-modal__container-item
    height: 100%
    padding: 0 !important
</style>

<template lang="pug">
.order-modal-works.pa-2(v-if='!newOrder')
  .text-h5.mb-4 Выполненная работа
  a-autocomplete(
    v-model='work',
    label='Выполненная работа',
    icon='mdi-account-cowboy-hat',
    endpoint='/completed-work',
    dense
  )
  template(v-if='work')
    v-slide-y-transition
      v-form(ref='form')
        v-container(fluid)
          v-row
            v-col(cols='6')
              a-input(
                v-bind='{style: "appearance: textfield;"}',
                v-model='model.header',
                label='Название',
                hide-details,
                dense
              )
            v-col(cols='6')
              a-input(
                v-model='model.message',
                label='Описание',
                hide-details,
                dense
              )
            v-col(cols='6')
              a-input(
                v-model='model.price',
                :validate='[(v) => v > 0 || "Введите число без лишних знаков"]',
                type='number',
                label='Цена',
                hide-details,
                dense
              )
            v-col(cols='6')
              v-btn(
                @click='sendWork',
                color='primary',
                block
              ) Добавить
  template(v-if='order.statusWork')
    span {{ order.statusWork }}
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { ordersModule, authModule } from '@/store'
import { ordersAPI } from '@/api'

@Component
export default class MOrderModalWorks extends Vue {
  @Ref('form') form!: any
  @Prop({ required: true, type: Boolean }) newOrder!: boolean

  public work = null

  @Watch('work')
  onWorkChange() {
    if (this.work) {
      if (typeof this.work === 'string') {
        this.model.header = this.work
      } else {
        this.model = this.work
      }
    } else {
      this.resetModel()
    }
  }

  public model: any = {
    userid: null,
    username: '',
    header: '',
    message: '',
    price: 0,
  }

  get order() {
    return ordersModule.currentOrder
  }

  async sendWork() {
    try {
      if (this.order) {
        this.model.userid = authModule.user.id
        this.model.username = authModule.user.username

        if (this.model.userid || this.model.username) {
          const response = await ordersAPI(this.order.id).addCompletedWork(this.model)

          if (response) {
            this.$notification.success('Успешное закрытие работы')
            ordersModule.getOrder(this.order.id)
            this.resetModel()
            this.work = null
          } else {
            this.$notification.error('[Клиент] Ошибка при закрытии работы')
          }
        } else {
          this.$notification.error('[Клиент] Не удалось получить достаточно данных пользователя')
        }
      } else {
        this.$notification.error('[Клиент] Неожиданная ошибка. Перезагрузите страницу')
      }
    } catch (error) {
      this.$notification.error('[Сервер] Ошибка при закрытии работы')
    }
  }

  resetModel() {
    this.model = {
      userid: null,
      username: '',
      header: '',
      message: '',
      price: 0,
    }
  }
}
</script>

<style lang="sass"></style>

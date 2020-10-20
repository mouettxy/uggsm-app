<template lang="pug">
.order-modal-works.pa-2(v-if='!newOrder')
  .text-h5.mb-4 Выполненная работа
  a-autocomplete(
    v-model='work',
    label='Выполненная работа',
    icon='mdi-hammer-screwdriver',
    endpoint='/completed-work',
    dense
  )
  v-slide-y-transition
    template(v-if='work')
      v-form(
        ref='form',
        @submit.prevent='sendWork'
      )
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
              @click.prevent='sendWork',
              type='submit',
              color='primary',
              block
            ) Добавить
  template(v-if='order.statusWork')
    v-data-table(
      :single-expand='true',
      :items='order.statusWork',
      :headers='tableHeaders',
      show-expand,
      no-data-text='Нет закрытых работ',
      hide-default-footer,
      dense
    )
      template(#expanded-item='{headers, item}')
        td(:colspan='headers.length')
          | Описание: {{ getMessage(item.id) }}
  .text-h6.text-right.my-8.success--text Итого: {{ total }}
  .text-h5.my-4 Оставьте комментарий
  template(v-if='user.role === "master" || user.role === "administrator"')
    v-form(
      ref='masterCommentForm',
      @submit.prevent='addMasterComment'
    )
      a-textarea(
        v-model='masterComment.message',
        label='Комментарий мастера',
        hide-details,
        dense
      )
      v-slide-y-transition
        v-btn.my-2(
          v-if='masterComment.message',
          @click.prevent='addMasterComment',
          color='primary'
        ) Отправить
  template(v-if='user.role === "manager" || user.role === "administrator"')
    v-form(
      ref='managerCommentForm',
      @submit.prevent='addManagerComment'
    )
      a-textarea(
        v-model='masterComment.message',
        label='Комментарий менеджера',
        hide-details,
        dense
      )
      v-slide-y-transition
        v-btn.my-2(
          v-if='masterComment.message',
          @click.prevent='addManagerComment',
          color='primary'
        ) Отправить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { ordersModule, authModule } from '@/store'
import { ordersAPI } from '@/api'
import { find, reduce } from 'lodash'

@Component
export default class MOrderModalWorks extends Vue {
  @Ref('form') form!: any
  @Ref('masterCommentForm') masterCommentForm!: any
  @Ref('managerCommentForm') managerCommentForm!: any
  @Prop({ required: true, type: Boolean }) newOrder!: boolean

  public work = null
  public tableHeaders = [
    {
      text: '№',
      value: 'id',
    },
    {
      text: 'Мастер',
      value: 'credentials',
    },
    {
      text: 'Название',
      value: 'header',
    },
    {
      text: 'Цена',
      value: 'price',
    },
  ]

  public model: any = {
    userid: null,
    username: '',
    header: '',
    message: '',
    price: 0,
  }
  public masterComment: any = {
    userid: null,
    message: '',
  }
  public managerComment: any = {
    userid: null,
    message: '',
  }
  @Watch('work')
  onWorkChange() {
    if (this.work) {
      if (typeof this.work === 'string') {
        this.model.header = this.work
      } else {
        this.model = this.work
      }
    } else {
      this.resetModels()
    }
  }

  get total() {
    if (this.order) {
      return reduce(
        this.order.statusWork,
        (a, e) => {
          a += e.price
          return a
        },
        0
      )
    } else {
      return 0
    }
  }

  get order() {
    return ordersModule.currentOrder
  }

  get user() {
    return authModule.user
  }

  getMessage(id: number) {
    if (this.order) {
      return find(this.order.statusWork, { id })?.message
    } else {
      return 'Не удалось получить описание'
    }
  }

  async sendWork() {
    try {
      if (this.order) {
        this.model.userid = authModule.user?.id
        this.model.username = authModule.user?.username
        this.model.credentials = authModule.user?.credentials

        if (this.model.userid || this.model.username) {
          const response = await ordersAPI(this.order.id).addCompletedWork(this.model)

          if (response) {
            this.$notification.success('Успешное закрытие работы')
            this.resetModels()
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

  async addMasterComment() {
    try {
      if (this.order) {
        this.masterComment.userid = authModule.user?.id

        if (this.masterComment.userid) {
          const response = await ordersAPI(this.order.id).addMasterComment(this.masterComment)

          if (response) {
            this.$notification.success('Успешное добавление комментария')
            this.resetModels()
            this.work = null
          } else {
            this.$notification.error('[Клиент] Ошибка при добавлении коментария')
          }
        } else {
          this.$notification.error('[Клиент] Не удалось получить достаточно данных пользователя')
        }
      } else {
        this.$notification.error('[Клиент] Неожиданная ошибка. Перезагрузите страницу')
      }
    } catch (error) {
      this.$notification.error('[Сервер] Ошибка при добавлении коментария')
    }
  }

  async addManagerComment() {
    try {
      if (this.order) {
        this.managerComment.userid = authModule.user?.id

        if (this.managerComment.userid) {
          const response = await ordersAPI(this.order.id).addManagerComment(this.managerComment)

          if (response) {
            this.$notification.success('Успешное добавление комментария')
            this.resetModels()
            this.work = null
          } else {
            this.$notification.error('[Клиент] Ошибка при добавлении коментария')
          }
        } else {
          this.$notification.error('[Клиент] Не удалось получить достаточно данных пользователя')
        }
      } else {
        this.$notification.error('[Клиент] Неожиданная ошибка. Перезагрузите страницу')
      }
    } catch (error) {
      this.$notification.error('[Сервер] Ошибка при добавлении коментария')
    }
  }

  resetModels() {
    this.model = {
      userid: null,
      username: '',
      header: '',
      message: '',
      price: 0,
    }
    this.masterComment = {
      userid: null,
      message: '',
    }
    this.managerComment = {
      userid: null,
      message: '',
    }
  }
}
</script>

<style lang="sass"></style>

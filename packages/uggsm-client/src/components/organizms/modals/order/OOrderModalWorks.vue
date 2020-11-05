<template lang="pug">
.order-modal-works.pa-2(v-if='!newOrder')
  .text-h5.mb-4 Выполненная работа
  a-autocomplete(
    v-if='!isOrderClosed',
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
            a-autocomplete(
              v-model='model.user',
              :uri-query='{ "return-value": "id" }',
              :predefined-items='[model.user]',
              return-object,
              label='Исполнитель',
              icon='mdi-account-hard-hat',
              endpoint='/users',
              dense
            )
          v-col(cols='12')
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
      template(#item.actions='{item}')
        v-btn(
          :disabled='isOrderClosed',
          @click='deleteWork(item)',
          icon,
          color='red'
        )
          v-icon mdi-delete
  .text-h6.text-right.my-8.success--text Итого: {{ total }}
  .text-h5.my-4 Комментарий
  v-form(
    ref='commentForm',
    @submit.prevent='addComment'
  )
    a-textarea(
      v-model='comment.message',
      label='Комментарий',
      hide-details,
      dense
    )
    v-slide-y-transition
      v-btn.my-2(
        v-if='comment.message',
        @click.prevent='addComment',
        color='primary'
      ) Отправить
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
import { ordersModule, authModule } from '@/store'
import { ordersAPI } from '@/api'
import { find, reduce } from 'lodash'
import { Order } from '@/typings/api/order'

@Component
export default class OOrderModalWorks extends Vue {
  @Ref('form') form!: any
  @Ref('commentForm') commentForm!: any
  @Prop({ required: true }) newOrder!: boolean
  @Prop({ required: true, default: null }) order!: Order | null

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
    {
      text: 'Действия',
      value: 'actions',
    },
  ]

  public model: any = {
    user: { text: this.order?.master.credentials, value: this.order?.master.id },
    username: '',
    header: '',
    message: '',
    price: 0,
  }

  public comment: any = {
    userid: null,
    message: '',
  }

  @Watch('modelUser')
  onModelUserChange(value: any) {
    if (!value) {
      this.model.user = { text: this.order?.master.credentials, value: this.order?.master.id }
    }
  }

  get isOrderClosed() {
    if (authModule.user?.role === 'administrator') {
      return false
    }

    if (this.order?.closedAt) {
      return true
    } else {
      return false
    }
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

  get modelUser() {
    return this.model.user
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
        if (!this.model.user) {
          this.model.user = { text: this.order.master.credentials, value: this.order.master.id }
        }

        this.model.userid = this.model.user.value
        this.model.credentials = this.model.user.text

        delete this.model.user

        if (this.model.userid) {
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

  async deleteWork(item: any) {
    try {
      if (this.order) {
        const response = await ordersAPI(this.order.id).deleteCompletedWork(item.id)

        if (response) {
          this.$notification.success('Успешное удаление работы')
        } else {
          this.$notification.error('[Клиент] Ошибка при удалении работы')
        }
      }
    } catch (error) {
      this.$notification.error('[Сервер] Ошибка при удалении работы')
    }
  }

  async addComment() {
    try {
      if (this.order) {
        this.comment.userid = authModule.user?.id

        if (this.comment.userid) {
          const response = await ordersAPI(this.order.id).addMasterComment(this.comment)

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
    this.comment = {
      userid: null,
      message: '',
    }
  }
}
</script>

<style lang="sass"></style>

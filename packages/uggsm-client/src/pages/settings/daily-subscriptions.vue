<route>
{
  "name": "settingsDailySubscriptions",
  "meta": {
    "header": "Подписка на ежедневные отчёты"
  }
}
</route>

<template lang="pug">
.page-settings-daily-subscriptions
  v-card.pa-8
    v-card-title Подписка на ежедневные отчёты
    v-card-text
      v-form(
        ref='form',
        v-model='isFormValid',
        @submit.prevent='handleCreateSubscription'
      )
        v-row
          v-col(
            cols='12',
            md='8',
            lg='8'
          )
            ug-base-input(
              v-model='email',
              :rules='emailRules',
              label='E-mail'
            )
          v-col(
            cols='12',
            md='4',
            lg='4'
          )
            ug-base-btn(
              type='submit',
              label='Добавить',
              color='primary',
              block
            ) 
      v-slide-y-transition(group)
        template(v-if='dailySubscriptions.length')
          v-row.align-center(
            v-for='subscription in dailySubscriptions',
            :key='subscription.email'
          )
            v-col(cols='10')
              span.text-subtitle-1 {{ subscription.email }}
            v-col.text-center(cols='2')
              ug-base-btn(
                @click='handleDeleteSubscription(subscription._id)',
                icon='mdi-delete',
                color='error'
              )
      v-slide-y-reverse-transition
        v-row(v-if='!dailySubscriptions.length')
          v-col(cols='12')
            v-alert(type='info') Нет подписанных адресов
</template>

<script>
import UgBaseInput from '@/components/base/ui/base-input/base-input'
import UgBaseBtn from '@/components/base/ui/base-btn/base-btn'

import EmailSubscriptionAPI from '@/api/emailSubscription'

export default {
  layout: 'centered',

  name: 'ug-daily-subscriptions',

  components: {
    UgBaseInput,
    UgBaseBtn,
  },

  sockets: {
    ['update email subscriptions']() {
      this.getSubscriptions()
    },
  },

  data: function () {
    return {
      email: '',
      subscriptions: [],
      isFormValid: true,
    }
  },

  computed: {
    dailySubscriptions() {
      if (!this.subscriptions) {
        return []
      }

      return this.subscriptions.filter((e) => e.type === 'daily-report')
    },

    emailRules() {
      return [(v) => /^([a-z0-9_.-]+@[\da-z.-]+\.[a-z.]{2,6})$/g.test(this.email) || 'Введите валидный Email адрес']
    },
  },

  methods: {
    rewindSubscription() {
      this.email = ''
    },

    async getSubscriptions() {
      const response = await EmailSubscriptionAPI.getAll()

      if (response.status !== 200) {
        this.$notification.error(`Ошибка при получении списка подписок`)
        return
      }

      this.subscriptions = response.data
    },

    async handleCreateSubscription() {
      const response = await EmailSubscriptionAPI.create({
        type: 'daily-report',
        email: this.email,
      })

      if (response.status !== 200) {
        this.$notification.error(`Ошибка при подписке на ежедневный отчёт`)
        return
      }

      this.$notification.success(`${this.email} Успешно подписан на ежедневный отчёт`)
      this.rewindSubscription()
    },

    async handleDeleteSubscription(id) {
      const response = await EmailSubscriptionAPI.delete(id)

      if (response.status !== 200) {
        this.$notification.error(`Ошибка при отписке на ежедневный отчёт`)
        return
      }

      this.$notification.success(`Почта успешно отписана от ежедневных отчётов`)
    },
  },

  mounted: function () {
    this.getSubscriptions()
  },
}
</script>

<style lang="sass">
.page-settings-daily-subscriptions
  margin: 0 auto

  .v-card__title
    word-break: break-word
</style>

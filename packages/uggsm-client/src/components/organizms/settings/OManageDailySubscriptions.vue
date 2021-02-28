<template lang="pug">
.manage-daily-subscriptions
  v-row.align-center
    v-col(cols='2')
      ug-base-input(
        v-model='email',
        label='E-mail'
      )
    v-col(cols='2')
      v-btn(
        @click='addSubscription',
        color='primary'
      ) Добавить
  v-slide-y-transition(group)
    v-row.align-center(
      v-for='subscription in subscriptions',
      v-if='isSubscriptionsExist',
      :key='subscription.email'
    )
      v-col(cols='2')
        span.text-subtitle-1 {{ subscription.email }}
      v-col(cols='2')
        v-btn(
          @click='deleteSubscription(subscription._id)',
          icon,
          color='error'
        )
          v-icon mdi-delete
  v-slide-y-reverse-transition
    v-row(v-if='!isSubscriptionsExist')
      v-col(cols='3')
        v-alert(type='info') Нет подписанных адресов
</template>

<script lang="ts">
import UgBaseInput from '@/components/base/ui/base-input/base-input.vue'

import { Component, Vue } from 'vue-property-decorator'
import { emailSubscriptionModel } from '@/store'

@Component({
  components: {
    UgBaseInput,
  },
})
export default class ManageDailySubscriptions extends Vue {
  public email = ''

  get subscriptions() {
    return emailSubscriptionModel.dailySubscriptions
  }

  get isSubscriptionsExist() {
    return this.subscriptions && this.subscriptions.length
  }

  async addSubscription() {
    const response = await emailSubscriptionModel.createDailySubscription(this.email)

    if (response) {
      this.$notification.success(`${this.email} Успешно подписан на ежедневный отчёт`)
      this.email = ''
    } else {
      this.$notification.success(`Ошибка при подписке на ежедневный отчёт`)
    }
  }

  async deleteSubscription(id: string) {
    const response = await emailSubscriptionModel.deleteSubscription(id)

    if (response) {
      this.$notification.success(`Почта успешно отписана от ежедневных отчётов`)
    } else {
      this.$notification.success(`Ошибка при отписке на ежедневный отчёт`)
    }
  }

  mounted() {
    emailSubscriptionModel.fetchDailySubscriptions()
  }
}
</script>

<style lang="sass"></style>

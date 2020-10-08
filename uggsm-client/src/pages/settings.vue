<route>
{
  "name": "settings",
  "meta": {
    "header": "Настройки"
  }
}
</route>

<template lang="pug">
.page-settings.pa-4
  v-btn(
    :to='{ name: "register" }',
    color='primary'
  ) Новый пользователь
  br.my-4
  v-btn(
    :to='{ name: "office" }',
    color='primary'
  ) Новый офис
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageSettings extends Vue {
  mounted() {
    document.title = this.$route.meta.header
  }
}
</script>

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
  v-alert(type='error')
    | Страница настроек находится в статусе активной разработки.
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

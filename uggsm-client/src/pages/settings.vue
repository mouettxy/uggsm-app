<route>
{
  "name": "settings"
}
</route>

<template lang="pug">
.page-settings
  v-alert(type='error')
    | Страница настроек находится в статусе активной разработки.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class PageSettings extends Vue {}
</script>

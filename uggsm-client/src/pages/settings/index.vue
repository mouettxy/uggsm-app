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
  t-settings-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'settings',
})
export default class PageSettings extends Vue {}
</script>

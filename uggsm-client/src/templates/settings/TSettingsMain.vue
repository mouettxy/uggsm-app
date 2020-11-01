<template lang="pug">
.settings-main
  .settings-main__content.pa-4
    v-alert(type='error')
      | Страница настроек находится в статусе разработки, попробуйте перейти в боковое меню.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

/**
 * Template of main order view
 *
 */
@Component
export default class TOrdersMain extends Vue {}
</script>

<route>
{
  "name": "office",
  "meta": {
    "header": "Новый офис"
  }
}
</route>

<template lang="pug">
.page-office
  t-office-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  layout: 'centered',
})
export default class PageOffice extends Vue {
  mounted() {
    document.title = this.$route.meta.header
  }
}
</script>

<style lang="sass">
.page-office
  width: 100%
</style>

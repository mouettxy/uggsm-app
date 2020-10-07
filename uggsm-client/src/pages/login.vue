<route>
{
  "name": "login",
  "meta": {
    "header": "Авторизация"
  }
}
</route>

<template lang="pug">
.page-login
  t-login-main
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import TLoginMain from '@/templates/TLoginMain.vue'

@Component({
  layout: 'centered',
  components: {
    TLoginMain,
  },
})
export default class PageLogin extends Vue {
  mounted() {
    document.title = this.$route.meta.header
  }
}
</script>

<style lang="sass">
.page-login
  width: 100%
</style>

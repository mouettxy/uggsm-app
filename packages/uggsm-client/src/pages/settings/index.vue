<route>
{
  "name": "settings",
  "meta": {
    "header": "Настройки",
    "resource": "Settings"
  }
}
</route>

<template lang="pug">
.page-settings.pa-4
  ug-role-widget
</template>

<script>
import UgRoleWidget from '@/components/role/role-widget'

export default {
  name: 'page-settings',

  components: {
    UgRoleWidget,
  },
}
</script>

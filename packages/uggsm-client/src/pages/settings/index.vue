<route>
{
  "name": "settings",
  "meta": {
    "header": "Настройки"
  }
}
</route>

<template>
  <div class="ug-page-settings pa-4">
    <ug-role-widget></ug-role-widget>
  </div>
</template>

<script>
import UgRoleWidget from '@/components/role/role-widget'

export default {
  name: 'ug-page-settings',

  components: {
    UgRoleWidget,
  },
}
</script>

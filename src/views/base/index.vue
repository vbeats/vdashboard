<template>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "Base",
  setup() {
    const checkToken = () => {
      console.log('checkToken...' + new Date())
      setTimeout(checkToken, 3000)
    }
    checkToken()

    return {}
  }
})
</script>

<style lang="stylus" scoped>
</style>
<template>
  <span>Copyright © 2019 - {{ year }} vbeats</span>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import dayjs from "dayjs"

export default defineComponent({
  name: "CopyRight",
  setup() {
    const year = ref<number>(dayjs().year())

    return {
      year
    }
  }
})
</script>

<style scoped lang="stylus">
span
  display flex
  justify-content center
  color rgba(0, 0, 0, .45)
  font-size 14px
</style>
<template>
  <span class="flex justify-center text-gray-400 text-sm">Copyright © 2019 - {{ year }} vbeats</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import dayjs from 'dayjs'

export default defineComponent({
  name: 'CopyRight',
  setup () {
    const year = ref<number>(dayjs().year())

    return {
      year
    }
  }
})
</script>

<style scoped>

</style>

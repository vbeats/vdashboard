<template>
  <span class="flex justify-center text-gray-400 text-md">Copyright © 2019 - {{ year }} vbeats</span>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import dayjs from 'dayjs'
const year = ref<number>(dayjs().year())
</script>

<style scoped></style>
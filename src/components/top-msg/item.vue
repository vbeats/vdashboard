<template>
  <div class="flex flex-col w-full">
    <div v-for="item in data" class="item w-full flex flex-row items-center justify-between" :key="item.id">
      <div class="w-3/2 flex flex-col">
        <div>{{ item.msg }}</div>
        <span class="text-sm">{{ item.create_time }}</span>
      </div>
      <div class="w-1/3">
        <el-button type="primary" v-if="item.status===0">&nbsp;阅&nbsp;</el-button>
        <el-button type="danger" v-else-if="item.status===1">已阅</el-button>
        <el-button type="success" v-else>阅阅</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {defineProps} from "vue"

const props = defineProps({
  data: {
    type: Array,
    required: false
  }
})
</script>

<style scoped lang="stylus">
.item
  border-bottom 1px solid #F2F2F2
</style>
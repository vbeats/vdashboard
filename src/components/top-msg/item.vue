<template>
  <div class="flex flex-col w-full">
    <div v-for="item in data" :key="item.id" class="item w-full flex flex-row items-center justify-between">
      <div class="w-3/2 flex flex-col">
        <div>{{ item.msg }}</div>
        <span class="text-sm">{{ item.createTime }}</span>
      </div>
      <div class="w-1/3">
        <el-button v-if="item.status===0" type="primary">&nbsp;阅&nbsp;</el-button>
        <el-button v-else-if="item.status===1" type="danger">已阅</el-button>
        <el-button v-else type="success">阅阅</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps({
  data: {
    type: Array,
    required: false
  }
})
</script>

<style lang="stylus" scoped>
.item
  border-bottom 1px solid #F2F2F2
</style>
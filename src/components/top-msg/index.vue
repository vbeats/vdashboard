<template>
  <div class="ml-auto mr-[25px] cursor-pointer">
    <el-popover :width="300" trigger="hover">
      <template #reference>
        <div class="relative w-20 h-[48px] flex justify-center items-center">
          <el-icon class="text-lg">
            <Bell/>
          </el-icon>
          <div class="absolute top-1/4 right-1/3 w-[6px] h-[6px] rounded-full bg-[#F56C6C]"></div>
        </div>
      </template>
      <template #default>
        <msg-item :data="msgs"/>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import MsgItem from './item.vue'

const msgs = [
  {
    id: 1,
    msg: 'test.............',
    createTime: '2022-09-01 10:10:10',
    status: 0
  },
  {
    id: 2,
    msg: 'test.............',
    createTime: '2022-09-01 10:10:10',
    status: 0
  },
  {
    id: 3,
    msg: 'test.............',
    createTime: '2022-09-01 10:10:10',
    status: 2
  },
  {
    id: 4,
    msg: 'test.............',
    createTime: '2022-09-01 10:10:10',
    status: 1
  },
  {
    id: 5,
    msg: 'test.............',
    createTime: '2022-09-01 10:10:10',
    status: 1
  },
]

</script>

<style lang="stylus" scoped>

</style>
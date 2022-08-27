<template>
  <el-container>
    <el-aside width="200px">
      菜单....
    </el-aside>
    <el-container>
      <el-header>
        header....
      </el-header>
      <el-main>
        content....
      </el-main>
      <el-footer>
        <copy-right/>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import CopyRight from '../components/copyright/index.vue'
import {useStorage} from "@vueuse/core";

const storage = useStorage('user', null)

</script>

<style scoped lang="stylus">

</style>
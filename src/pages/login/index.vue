<template>
  <div class="login w-screen h-screen flex flex-col items-center justify-center">
    <div class="mx-auto w-2/3 h-2/3">
      <div class="flex flex-row items-center bg-white rounded-lg shadow-2xl w-full h-full">
        <img src="../../assets/img/login.svg" alt="" class="hidden w-1/2 md:flex">
        <div class="flex flex-col justify-center items-center w-1/2">
          <span class="text-2xl font-bold">Vcloud 平台管理系统</span>
          <el-divider class="w-3/5 mb-12"/>
          <account-login/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountLogin from "../../components/login/AccountLogin.vue"</script>

<style scoped lang="stylus">
@import './index.styl'
</style>
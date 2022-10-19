<template>
  <div class="login w-screen h-screen flex flex-col items-center justify-center">
    <div class="mx-auto w-full h-screen lg:w-3/5 lg:h-3/5 2xl:w-1/2">
      <div class="flex flex-row items-center bg-white rounded-lg shadow-2xl h-screen w-full lg:h-full">
        <img src="../../assets/img/login.svg" alt="" class="hidden w-1/2 md:flex">
        <div class="flex flex-col justify-center items-center sm:w-full lg:w-1/2">
          <span class="text-2xl font-bold">Vcloud 平台管理系统</span>
          <el-divider class="w-3/5 mb-12"/>
          <account-login @handle-login="handleLogin"/>
        </div>
      </div>
    </div>
  </div>
  <copy-right class="fixed bottom-12 w-full mx-auto"/>
</template>

<script setup lang="ts">
import AccountLogin from "../../components/login/AccountLogin.vue"
import CopyRight from '../../components/copyright/index.vue'
import {useUserStore} from "../../store/user"
import {useRouter} from "vue-router"
import {useMenuStore} from "../../store/menu"
import initRoutes from "../../router/initRoutes"

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

const handleLogin = async (param: any) => {

  userStore.saveToken({id: param.id, tenant_id: param.tenant_id, tenant_code: param.tenant_code, token: param.token})

  await userStore.getProfile()

  await menuStore.updateMenu()

  // 初始化路由
  initRoutes()

  await router.replace({name: 'index'})
}
</script>

<style scoped lang="stylus">
@import './index.styl'
</style>
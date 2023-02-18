<template>
  <div class="login w-screen h-screen flex flex-col items-center justify-center">
    <div class="mx-auto w-full h-screen lg:w-3/5 lg:h-3/5 2xl:w-1/2">
      <div class="flex flex-row items-center bg-white rounded-lg shadow-2xl h-screen w-full lg:h-full">
        <img alt="" class="hidden w-1/2 md:flex" src="../../assets/img/login.svg">
        <div class="flex flex-col justify-center items-center sm:w-full lg:w-1/2">
          <span class="text-2xl font-bold">Vcloud 运营平台</span>
          <el-divider class="w-3/5 mb-12"/>
          <account-login @handle-login="handleLogin"/>
        </div>
      </div>
    </div>
  </div>
  <copy-right class="fixed bottom-12 w-full mx-auto"/>
</template>

<script lang="ts" setup>
import AccountLogin from "../../components/login/AccountLogin.vue"
import CopyRight from '../../components/copyright/index.vue'
import {useUserStore} from "../../store/user"
import {useRouter} from "vue-router"
import {useMenuStore} from "../../store/menu"
import initRoutes from "../../router/initRoutes"
import {User} from "../../store/user/IUser"

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

const handleLogin = async (param: User) => {

  userStore.saveToken({...param})

  await menuStore.updateMenu()

  // 初始化路由
  initRoutes()

  await router.replace({name: 'index'})
}
</script>

<style lang="stylus" scoped>
@import './index.styl';
</style>
<template>
  <div class="avatar flex flex-row items-center mr-4 cursor-pointer">
    <el-dropdown @command="handleItem">
        <span class="flex flex-row items-center">
            <img src="../../assets/img/avatar.png" alt="" class="w-[32px] h-[32px]">
            <span class="mx-2 text-xs">{{ userStore.username }}</span>
            <el-icon class="ml-4">
              <ArrowDown/>
            </el-icon>
          </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item divided command="logout">退&nbsp;&nbsp;&nbsp;&nbsp;出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>


</template>

<script lang="ts" setup>
import {useUserStore} from "../../store/user"
import {useRouter} from "vue-router"

const userStore = useUserStore()
const router = useRouter()

const handleItem = async (cmd: string) => {
  switch (cmd) {
    case 'profile':
      await router.push({name: 'profile'})
      break
    case 'logout':
      await userStore.logout()
      await router.replace({name: 'login'})
      break
  }
}
</script>

<style scoped lang="stylus">

</style>
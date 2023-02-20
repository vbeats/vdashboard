<template>
  <div class="avatar flex flex-row items-center mr-4 cursor-pointer">
    <el-dropdown @command="handleItem">
        <span class="flex flex-row items-center">
            <img alt="" class="w-[32px] h-[32px]" src="../../assets/img/avatar.png">
            <span class="mx-2 text-xs">{{ userStore.account }}</span>
            <el-icon class="ml-4">
              <ArrowDown/>
            </el-icon>
          </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退&nbsp;&nbsp;&nbsp;&nbsp;出</el-dropdown-item>
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
      location.href = '/login'
      break
  }
}
</script>

<style lang="stylus" scoped>

</style>
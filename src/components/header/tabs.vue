<template>
  <el-scrollbar>
    <div class="tabs px-4 flex flex-row h-[28px] items-center">
      <div
          @mouseenter="()=>currentTab='0'" @mouseleave="()=>currentTab=''" @click.stop="clickTab('/index','0','index')"
          :class="[tabs.length===0 || currentTab==='0' ||activeTab==='0' ? 'active':'', 'tab', 'h-[26px]', 'px-2' ,'ml-2', 'flex', 'flex-row', 'justify-between' ,'items-center', 'text-xs', 'cursor-pointer', 'hover:text-blue-500']">
        首页
      </div>

      <div v-for="item in tabs" :key="item.id" @mouseenter="onMouseEnter(item)" @mouseleave="onMouseLeave(item)" @click.stop="clickTab(item.path,item.id,item.key)"
           :class="[currentTab===item.id || activeTab===item.id ? 'active':'', 'tab', 'h-[26px]', 'px-2' ,'ml-2', 'flex', 'flex-row', 'justify-between' ,'items-center', 'text-xs', 'cursor-pointer', 'hover:text-blue-500']">
        {{ item.title }}
        <el-icon class="ml-2 hover:text-base" @click.stop="closeTab(item)">
          <Close/>
        </el-icon>
      </div>
    </div>
  </el-scrollbar>
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import {useMenuStore} from "../../store/menu"
import {useRouter} from "vue-router"

const router = useRouter()
const menuStore = useMenuStore()

const currentTab = computed(() => menuStore.currentTab)  // tab id
const activeTab = ref('')

const tabs = computed(() => menuStore.tabs)

const onMouseEnter = (item: any) => {
  activeTab.value = item.id
}

const onMouseLeave = (item: any) => {
  activeTab.value = ''
}

const closeTab = async (item: any) => {
  await menuStore.removeTab(item)
  const path = tabs.value && tabs.value.length > 0 ? (tabs.value[tabs.value.length - 1] as any).path : '/index'
  if (path === '/index') {
    activeTab.value = ''
  }
  router.replace({path})
}

const clickTab = (path: string, tabId: string, key: string) => {
  menuStore.updateCurrentTab(tabId, key)
  router.replace({path})
}

</script>

<style scoped lang="stylus">
.tabs
  border-bottom 1px solid rgb(246, 246, 246)

  .tab
    border 1px solid #e5e7eb

  .active
    color #fff
    background #0960BD
</style>
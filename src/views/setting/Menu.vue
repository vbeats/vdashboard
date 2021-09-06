<template>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增菜单
  </a-button>
  <!--table-->
  <a-table :columns="columns"
           :data-source="datasource"
           :loading="loading"
           :pagination="{total,current,pageSize}"
           :row-key="record => record.id"
           :scroll="{x:1000}"
           bordered class="mt-8" @change="handleTableChange"
  >
    <template #show="{text}">
      <a-tag v-if="text===true" color="#87d068">是</a-tag>
      <a-tag v-else color="#f50">否</a-tag>
    </template>
    <template #select="{text}">
      <a-tag v-if="text===1" color="#87d068">是</a-tag>
      <a-tag v-else color="#f50">否</a-tag>
    </template>
    <template #open="{text}">
      <a-tag v-if="text===1" color="#87d068">是</a-tag>
      <a-tag v-else color="#f50">否</a-tag>
    </template>
    <template #operation="{ record }">
      <a-space>
        <a-button type="primary" @click="showUpdateModal(record)">更新</a-button>
        <a-button type="danger" @click="handleDeleteMenu(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
  <!--  modal -->
  <menu-modal :action="action" :data="item" :menus="menus" :visible="visible" @cancel="handleModalCancel"
              @handleAddOrUpdateMenu="handleAddOrUpdateMenu"/>
</template>

<script lang="ts" setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { TableState } from 'ant-design-vue/es/table/interface'
import { addMenu, delMenu, getMenuList, getMenuParent, updateMenu } from '@/api/setting'
import { message } from 'ant-design-vue'
import MenuModal from '@/components/modal/setting/MenuModal.vue'

type Pagination = TableState['pagination']

const columns = [
  {
    title: '菜单',
    dataIndex: 'title'
  },
  {
    title: '顺序',
    dataIndex: 'sort'
  },
  {
    title: 'key',
    dataIndex: 'key'
  },
  {
    title: 'path',
    dataIndex: 'path'
  },
  {
    title: 'icon',
    dataIndex: 'icon'
  },
  {
    title: '父级',
    dataIndex: 'parent'
  },
  {
    title: '是否展示',
    dataIndex: 'show',
    slots: { customRender: 'show' }
  },
  {
    title: '默认选中',
    dataIndex: 'default_select',
    slots: { customRender: 'select' }
  },
  {
    title: '默认展开',
    dataIndex: 'default_open',
    slots: { customRender: 'open' }
  },
  {
    title: '操作',
    width: '300px',
    align: 'center',
    slots: { customRender: 'operation' }
  }
]
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const action = ref('add')
const visible = ref(false)
const menus = ref([])
const item = ref({})

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  menuList()
}

const menuList = () => {
  loading.value = true
  getMenuList({
    current: current.value,
    page_size: pageSize.value
  }).then(res => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

menuList()

// 删除菜单
const handleDeleteMenu = async (record: any) => {
  const res = await delMenu({ id: record.id })
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => menuList(), 800)
  }
}

const showUpdateModal = async (record: any) => {
  action.value = 'update'
  menus.value = await getMenus()
  visible.value = true
  item.value = record
}

const showAddModal = async () => {
  action.value = 'add'
  menus.value = await getMenus()
  visible.value = true
  item.value = {}
}

const handleModalCancel = () => {
  item.value = {}
  visible.value = false
}

const handleAddOrUpdateMenu = async (param: any) => {
  if (param.id && param.id > 0) {
    const res = await updateMenu(param)
    handleResult(res)
  } else {
    const res = await addMenu(param)
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    handleModalCancel()
    menuList()
  }
}

// 所有父级菜单
const getMenus = async () => {
  const res = await getMenuParent()
  return res.data
}

</script>

<style lang="stylus" scoped>

</style>

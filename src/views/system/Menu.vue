<template>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'menu:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增菜单
  </a-button>
  <!--table-->
  <a-table
    :columns="columns"
    :data-source="datasource"
    :loading="loading"
    :row-key="(record) => record.id"
    children-column-name="children"
    bordered
    class="mt-8"
    v-if="checkPerms(actions, 'menu:list')"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'type'">
        <a-tag v-if="record.type === 0" color="#108ee9">菜单</a-tag>
        <a-tag v-else color="#87d068">按钮</a-tag>
      </template>
      <template v-if="column.key === 'show'">
        <a-tag v-if="record.show" color="#87d068">是</a-tag>
        <a-tag v-else color="purple">否</a-tag>
      </template>
      <template v-if="column.key === 'default_select'">
        <a-tag v-if="record.default_select" color="#87d068">是</a-tag>
        <a-tag v-else color="purple">否</a-tag>
      </template>
      <template v-if="column.key === 'default_open'">
        <a-tag v-if="record.default_open" color="#87d068">是</a-tag>
        <a-tag v-else color="purple">否</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button type="primary" @click="showModal('update', record)" v-if="checkPerms(actions, 'menu:update')">更新</a-button>
          <a-button danger type="primary" @click="handleDeleteMenu(record)" v-if="checkPerms(actions, 'menu:delete')">删除 </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <MenuModal :visible="visible" :mode="mode" :item="item" :menu-list="menus" @handleOk="handleAddOrUpdateMenu" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {ref} from 'vue'
import {message} from 'ant-design-vue'
import {add, del, list, update} from '@/api/system/menu'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import MenuModal from '@/components/modal/system/MenuModal.vue'

const columns = [
  {
    title: '名称',
    dataIndex: 'title',
  },
  {
    title: 'key',
    dataIndex: 'key',
  },
  {
    title: '前端路由',
    dataIndex: 'path',
  },
  {
    title: 'Icon',
    dataIndex: 'icon',
  },
  {
    title: '顺序',
    dataIndex: 'sort',
  },
  {
    title: '类型',
    align: 'center',
    key: 'type',
  },
  {
    title: '权限字段',
    dataIndex: 'action',
  },
  {
    title: '展示',
    align: 'center',
    key: 'show',
  },
  {
    title: '默认选中',
    align: 'center',
    key: 'default_select',
  },
  {
    title: '默认展开',
    align: 'center',
    key: 'default_open',
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
  },
]

const actions: Array<string> = useRoute().meta.actions as Array<string>

const datasource = ref([])
const loading = ref(false)
const mode = ref('add')
const visible = ref(false)
const item = ref()
const menus = ref([])

const menuList = () => {
  loading.value = true
  list({type: 1}).then((res) => {
    loading.value = false
    datasource.value = res.data
  })
}

checkPerms(actions, 'menu:list') && menuList()

// 删除菜单
const handleDeleteMenu = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => menuList(), 800)
  }
}

const showModal = async (t: string, record: any = {}) => {
  const res = await list({type: 2})
  menus.value = res.data
  mode.value = t
  item.value = record
  visible.value = true
}

const handleModalCancel = () => {
  mode.value = 'add'
  item.value = {}
  visible.value = false
}

const handleAddOrUpdateMenu = async (param: any) => {
  if (param.id && param.id !== '') {
    const res = await update(param)
    handleResult(res)
  } else {
    const res = await add(param)
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    message.success('success')
    handleModalCancel()
    menuList()
  }
}
</script>

<style scoped lang="stylus"></style>

<template>
  <!--  查询角色 -->
  <a-form
    ref="formRef"
    :model="formState">
    <a-row>
      <a-col :span="4">
        <a-form-item name="name">
          <a-input v-model:value="formState.name" placeholder="角色名"/>
        </a-form-item>
      </a-col>
      <a-col :offset="1">
        <a-button type="primary" @click="roleList">查询</a-button>
      </a-col>
      <a-col :offset="1">
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增角色
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
    <template #operation="{ record }">
      <a-space>
        <a-button type="primary" @click="showRoleAdminModal(record)">用户</a-button>
        <a-button @click="showMenuModal(record)">菜单</a-button>
        <a-button type="primary" @click="showUpdateModal(record)">更新</a-button>
        <a-button type="danger" @click="handleDeleteRole(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
  <!--  modal -->
  <role-modal :action="action" :data="item" :visible="visible" @cancel="handleModalCancel"
              @handleAddOrUpdateRole="handleAddOrUpdateRole"/>

  <role-admin-modal :selected-keys="userIds" :visible="roleAdminVisible" @cancel="handleRoleAdminModalCancel"
                    @selectKeysChange="handleSelectedKeysChange" @updateRoleAdmin="updateRoleAdmin"/>

  <role-menu-modal :menus="menus" :visible="menuVisible" @cancel="handleRoleMenuCancel"
                   @handleUpdateRoleMenu="handleUpdateRoleMenu" @handleUpdateSelectMenu="handleUpdateSelectMenu"/>
</template>

<script lang="ts" setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { reactive, ref, UnwrapRef } from 'vue'
import { TableState } from 'ant-design-vue/es/table/interface'
import { message } from 'ant-design-vue'
import {
  addRole,
  assignRoleAdmin,
  assignRoleMenu,
  delRole,
  getMenuIdsByRoleId,
  getRoleList,
  getUserIdsByRoleId,
  updateRole
} from '@/api/setting'
import RoleModal from '@/components/modal/setting/RoleModal.vue'
import RoleAdminModal from '@/components/modal/setting/RoleAdminModal.vue'
import RoleMenuModal from '@/components/modal/setting/RoleMenuModal.vue'

interface FormState {
  name?: string
}

type Pagination = TableState['pagination']
const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '角色名',
    dataIndex: 'name'
  },
  {
    title: '操作',
    align: 'center',
    slots: { customRender: 'operation' }
  }
]
const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({})
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const action = ref('add')
const visible = ref(false)
const item = ref({})
const roleAdminVisible = ref(false)
const menuVisible = ref(false)
const userIds = ref([])
const currentRoleId = ref(0)
const menus = ref([])

const reset = () => {
  formRef.value.resetFields()
}

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  roleList()
}

const roleList = () => {
  loading.value = true
  getRoleList({
    current: current.value,
    page_size: pageSize.value,
    name: formState.name
  }).then(res => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

roleList()

// 删除角色
const handleDeleteRole = async (record: any) => {
  const res = await delRole({ id: record.id })
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => roleList(), 800)
  }
}

const showUpdateModal = async (record: any) => {
  action.value = 'update'
  visible.value = true
  item.value = record
}

const showAddModal = async () => {
  action.value = 'add'
  visible.value = true
  item.value = {}
}

const handleModalCancel = () => {
  item.value = {}
  visible.value = false
}

const handleAddOrUpdateRole = async (param: any) => {
  if (param.id && param.id > 0) {
    const res = await updateRole(param)
    handleResult(res)
  } else {
    const res = await addRole(param)
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    handleModalCancel()
    roleList()
  }
}

// 角色分配用户
const showRoleAdminModal = async (record: any) => {
  // 用户信息
  currentRoleId.value = record.id
  const res = await getUserIdsByRoleId({ id: record.id })
  userIds.value = res.data
  roleAdminVisible.value = true
}

const handleRoleAdminModalCancel = () => {
  userIds.value = []
  currentRoleId.value = 0
  roleAdminVisible.value = false
}

const handleSelectedKeysChange = (keys: any) => {
  userIds.value = keys
}

const updateRoleAdmin = async () => {
  const res = await assignRoleAdmin({
    role_id: currentRoleId.value,
    ids: userIds.value
  })
  if (res.code === 200) {
    message.success('分配成功')
    currentRoleId.value = 0
    userIds.value = []
    roleAdminVisible.value = false
  }
}

// 菜单分配
const showMenuModal = async (record: any) => {
  currentRoleId.value = record.id
  const res = await getMenuIdsByRoleId({ id: record.id })
  menus.value = res.data
  menuVisible.value = true
}

const handleUpdateSelectMenu = (keys: any) => {
  menus.value = keys
}

const handleRoleMenuCancel = () => {
  currentRoleId.value = 0
  menus.value = []
  menuVisible.value = false
}

const handleUpdateRoleMenu = async () => {
  const res = await assignRoleMenu({
    role_id: currentRoleId.value,
    ids: menus.value
  })
  if (res.code === 200) {
    message.success('success')
    currentRoleId.value = 0
    menus.value = []
    menuVisible.value = false
  }
}
</script>

<style lang="stylus" scoped>

</style>

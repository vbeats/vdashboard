<template>
  <!--  查询用户 -->
  <a-form
    ref="formRef"
    :model="formState">
    <a-row>
      <a-col :span="4">
        <a-form-item name="name">
          <a-input v-model:value="formState.username" placeholder="用户名"/>
        </a-form-item>
      </a-col>
      <a-col :offset="1">
        <a-button type="primary" @click="userList">查询</a-button>
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
    新增用户
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
    <template #status="{text}">
      <a-tag v-if="text===true" color="#87d068">正常</a-tag>
      <a-tag v-else color="#f50">禁用</a-tag>
    </template>
    <template #operation="{ record }">
      <a-space>
        <a-button type="primary" @click="showRoleModal(record)">角色</a-button>
        <a-button type="danger" @click="updateStatus(record)">{{ record.status ? '禁用' : '启用' }}</a-button>
        <a-button type="primary" @click="showUpdateModal(record)">更新</a-button>
        <a-button type="danger" @click="handleDeleteUser(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
  <!--  modal -->
  <admin-modal :action="action" :data="item" :visible="visible" @cancel="handleModalCancel"
               @handleAddOrUpdateAdmin="handleAddOrUpdateAdmin"/>

  <admin-role-modal :selected-keys="roleIds" :visible="roleVisible" @cancel="handleRoleModalCancel"
                    @selectKeysChange="handleSelectedKeysChange" @updateAdminRole="updateAdminRole"/>
</template>

<script lang="ts" setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { reactive, ref, UnwrapRef } from 'vue'
import { TableState } from 'ant-design-vue/es/table/interface'
import { message } from 'ant-design-vue'
import {
  addAdmin,
  assignRole,
  delAdmin,
  getAdminList,
  getRoleIdsByAdminId,
  updateAdmin,
  updateAdminStatus
} from '@/api/setting'
import AdminModal from '@/components/modal/setting/AdminModal.vue'
import encrypt from '@/util/crypto'
import AdminRoleModal from '@/components/modal/setting/AdminRoleModal.vue'

interface FormState {
  username?: string
}

type Pagination = TableState['pagination']
const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: '150px'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '100px',
    slots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: '180px'
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    width: '180px'
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
const roleVisible = ref(false)
const roleIds = ref<any>([])
const currentAdminId = ref(0)

const reset = () => {
  formRef.value.resetFields()
}

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  userList()
}

const userList = () => {
  loading.value = true
  getAdminList({
    current: current.value,
    page_size: pageSize.value,
    username: formState.username
  }).then(res => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

userList()

// 删除用户
const handleDeleteUser = async (record: any) => {
  const res = await delAdmin({ id: record.id })
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => userList(), 800)
  }
}

const showUpdateModal = async (record: any) => {
  action.value = 'update'
  item.value = record
  visible.value = true
}

const updateStatus = async (record: any) => {
  const res = await updateAdminStatus({ id: record.id })
  if (res.code === 200) {
    userList()
  }
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

const handleAddOrUpdateAdmin = async (param: any) => {
  if (param.id && param.id > 0) {
    const res = await updateAdmin({
      ...param,
      password: encrypt(param.password)
    })
    handleResult(res)
  } else {
    const res = await addAdmin({
      ...param,
      password: encrypt(param.password)
    })
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    message.success('success')
    handleModalCancel()
    userList()
  }
}

// 用户分配角色
const showRoleModal = async (record: any) => {
  currentAdminId.value = record.id
  // 此用户已分配的角色
  const res = await getRoleIdsByAdminId({ id: record.id })
  roleIds.value = res.data
  roleVisible.value = true
}

const handleRoleModalCancel = () => {
  roleIds.value = []
  currentAdminId.value = 0
  roleVisible.value = false
}

const handleSelectedKeysChange = (keys: any) => {
  roleIds.value = keys
}

const updateAdminRole = async () => {
  const res = await assignRole({
    admin_id: currentAdminId.value,
    ids: roleIds.value
  })
  if (res.code === 200) {
    message.success('分配成功')
    currentAdminId.value = 0
    roleIds.value = []
    roleVisible.value = false
  }
}

</script>

<style lang="stylus" scoped>

</style>

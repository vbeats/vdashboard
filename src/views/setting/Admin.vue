<template>
  <!--  查询用户 -->
  <a-form
    ref="formRef"
    :model="formState">
    <a-row>
      <a-col :span="4">
        <a-form-item name="username">
          <a-input v-model:value="formState.username" placeholder="用户名"/>
        </a-form-item>
      </a-col>
      <a-col :span="4" :offset="1">
        <a-form-item name="phone">
          <a-input v-model:value="formState.phone" placeholder="手机号"/>
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
    <template #roles="{text}">
      <a-tag v-for="item in text" :key="item.id" color="#87d068">{{ item.name }}</a-tag>
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
               :tenants="tenants"
               @handleAddOrUpdateAdmin="handleAddOrUpdateAdmin"/>

  <admin-role-modal :selected-keys="roleIds" :tenant-id="currentTenantId" :visible="roleVisible" @cancel="handleRoleModalCancel"
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
  getAdminList, getAllTenant,
  getRoleIdsByAdminId,
  updateAdmin,
  updateAdminStatus
} from '@/api/setting'
import AdminModal from '@/components/modal/setting/AdminModal.vue'
import encrypt from '@/util/crypto'
import AdminRoleModal from '@/components/modal/setting/AdminRoleModal.vue'
type Pagination = TableState['pagination']

interface FormState {
  username?: string,
  phone?:string
}

const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '所属租户',
    dataIndex: 'tenant_name'
  },
  {
    title: '手机号',
    dataIndex: 'phone'
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'status' }
  },
  {
    title: '角色',
    dataIndex: 'roles',
    slots: { customRender: 'roles' }
  },
  {
    title: '创建时间',
    dataIndex: 'create_time'
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time'
  },
  {
    title: '操作',
    align: 'center',
    width: '310px',
    fixed: 'right',
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
const currentAdminId = ref()
const currentTenantId = ref()
const tenants = ref([])

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
    username: formState.username,
    phone: formState.phone
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
  const res = await getAllTenant()
  tenants.value = res.data
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
  const res = await getAllTenant()
  tenants.value = res.data
  action.value = 'add'
  item.value = {}
  visible.value = true
}

const handleModalCancel = () => {
  item.value = {}
  visible.value = false
}

const handleAddOrUpdateAdmin = async (param: any) => {
  if (param.id && param.id !== '') {
    const res = await updateAdmin({
      ...param,
      platform: parseInt(process.env.VUE_APP_PLATFORM),
      password: encrypt(param.password)
    })
    handleResult(res)
  } else {
    const res = await addAdmin({
      ...param,
      platform: parseInt(process.env.VUE_APP_PLATFORM),
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
  currentTenantId.value = record.tenant_id
  // 此用户已分配的角色
  const res = await getRoleIdsByAdminId({ id: record.id })
  roleIds.value = res.data
  roleVisible.value = true
}

const handleRoleModalCancel = () => {
  roleIds.value = []
  currentAdminId.value = ''
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
    userList()
    currentAdminId.value = ''
    roleIds.value = []
    roleVisible.value = false
  }
}

</script>

<style lang="stylus" scoped>

</style>

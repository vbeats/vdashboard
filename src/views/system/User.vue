<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'user:list')">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="account">
          <a-input v-model:value="formState.account" placeholder="账号" />
        </a-form-item>
      </a-col>
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="phone">
          <a-input v-model:value="formState.phone" placeholder="手机" />
        </a-form-item>
      </a-col>
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="account_type">
          <a-select v-model:value="formState.account_type" placeholder="账号类型">
            <a-select-option :value="0">用户</a-select-option>
            <a-select-option :value="user.type === adminType ? 2 : 1">管理人员</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}" v-if="user.type === adminType">
        <a-form-item name="tenant_id">
          <a-select v-model:value="formState.tenant_id" placeholder="选择租户">
            <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col>
        <a-button type="primary" @click="userList">查询</a-button>
      </a-col>
      <a-col>
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'user:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增用户
  </a-button>
  <!--table-->
  <a-table
    :columns="columns"
    :data-source="datasource"
    :loading="loading"
    :pagination="{total, current, pageSize}"
    :row-key="(record) => record.id"
    bordered
    class="mt-8"
    @change="handleTableChange"
    v-if="checkPerms(actions, 'user:list')"
    :scroll="{x: 1500}"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'account_type'">
        <a-tag color="green" v-if="record.account_type === 0">用户</a-tag>
        <a-tag color="purple" v-else-if="record.account_type === 1">{{ user.type === adminType ? '租户账号' : '管理人员' }} </a-tag>
        <a-tag color="#87d068" v-else-if="record.account_type === 2">{{ user.type === adminType ? '平台账号' : '管理人员' }} </a-tag>
      </template>
      <template v-if="column.key === 'roles'">
        <a-space direction="vertical">
          <a-tag color="blue" v-for="(item, index) in (record.roles && record.roles.split(',')) || []" :key="index">
            {{ item }}
          </a-tag>
        </a-space>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag v-if="record.status" color="#87d068">正常</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button danger @click="showAssignRole(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'user:assign_role')"
            >角色
          </a-button>
          <a-button danger @click="showAssignDept(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'user:assign_dept')"
            >部门
          </a-button>
          <a-button danger type="primary" @click="updateStatus(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'user:disable')">
            {{ record.status ? '禁用' : '启用' }}
          </a-button>
          <a-button
            type="primary"
            @click="showModal('update', record)"
            :disabled="(record.delete_time && record.delete_time !== '') || record.account_type === 0"
            v-if="checkPerms(actions, 'user:update')"
            >更新
          </a-button>
          <a-button danger type="primary" @click="handleDeleteUser(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'user:delete')"
            >删除
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <UserModal
    :visible="visible"
    :mode="mode"
    :item="item"
    :tenants="tenants"
    @handleSelectKeys="handleSelectKeys"
    @handleOk="handleAddOrUpdateUser"
    @handleCancel="handleModalCancel"
  />
  <AssignRoleModal :visible="roleVisible" :item="item" :ids="ids" @handleSelectKeys="handleSelectKeys" @handleOk="handleAssignRole" @handleCancel="handleModalCancel" />
  <AssignDeptModal :visible="deptVisible" :item="item" :ids="ids" @handleSelectKeys="handleSelectKeys" @handleOk="handleAssignDept" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {message} from 'ant-design-vue'
import {add, assignDept, assignRole, del, list, update, updateStatus as updateUserStatus} from '@/api/system/user'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import {listAll as listAllTenants} from '@/api/system/tenant'
import {useStore} from 'vuex'
import UserModal from '@/components/modal/system/UserModal.vue'
import encrypt from '@/util/crypto'
import {listByUser as listRoleIdsByUser} from '@/api/system/role'
import {listByUser as listDeptIdsByUser} from '@/api/system/dept'
import AssignRoleModal from '@/components/modal/system/AssignRoleModal.vue'
import AssignDeptModal from '@/components/modal/system/AssignDeptModal.vue'
import {UserType} from '@/util/const'
import _ from 'lodash'

interface FormState {
  account?: string
  phone?: string
  tenant_id: string
  account_type?: number
}

let columns = [
  {
    title: '账号',
    dataIndex: 'account',
    width: 150,
    ellipsis: true,
  },
  {
    title: '昵称',
    dataIndex: 'nick_name',
    width: 120,
    ellipsis: true,
  },
  {
    title: '账号类型',
    dataIndex: 'account_type',
    width: 100,
    key: 'account_type',
  },
  {
    title: '手机',
    dataIndex: 'phone',
    width: 150,
    ellipsis: true,
  },
  {
    title: '角色',
    key: 'roles',
    width: 120,
    ellipsis: true,
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 200,
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    width: 200,
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
    width: 450,
    fixed: 'right',
  },
]

const actions: Array<string> = useRoute().meta.actions as Array<string>
const user = useStore().getters.getUserInfo
const adminType = UserType.ADMIN

user.type === adminType
  ? (columns = _.concat(
      columns.slice(0, 1),
      {
        title: '所属租户',
        dataIndex: 'tenant_name',
        width: 150,
        ellipsis: true,
      },
      columns.slice(1)
    ))
  : null

const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({tenant_id: user.tenant_id})
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const mode = ref('add')
const visible = ref(false)
const roleVisible = ref(false)
const deptVisible = ref(false)
const item = ref()
const tenants = ref([])
const ids = ref<Array<string>>([])

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  userList()
}

const userList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    account: formState.account,
    phone: formState.phone,
    account_type: formState.account_type,
    tenant_id: formState.tenant_id,
  }).then((res) => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

const tenantList = async () => {
  const res = await listAllTenants()
  tenants.value = res.data
  formState.tenant_id = user.tenant_id
}

tenantList()

checkPerms(actions, 'user:list') && userList()

// 删除用户
const handleDeleteUser = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => userList(), 800)
  }
}

// 修改用户状态
const updateStatus = async (record: any) => {
  const res = await updateUserStatus(record.id)
  if (res.code === 200) {
    message.success('更新成功')
    setTimeout(() => userList(), 800)
  }
}

const showModal = (t: string, record: any = {}) => {
  mode.value = t
  item.value = record
  visible.value = true
}

const handleModalCancel = () => {
  mode.value = 'add'
  item.value = {}
  ids.value = []
  visible.value = false
  roleVisible.value = false
  deptVisible.value = false
}

const handleAddOrUpdateUser = async (param: any) => {
  if (param.password && param.password !== '') {
    param.password = encrypt(param.password)
  }
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
    userList()
  }
}

// 选择key
const handleSelectKeys = (keys: Array<string>) => {
  ids.value = keys
}

// 分配角色
const showAssignRole = async (record: any) => {
  item.value = record
  // 此用户已有角色id
  ids.value = (await listRoleIdsByUser(record.id)).data || []
  roleVisible.value = true
}

const handleAssignRole = async (params: any) => {
  const res = await assignRole({id: item.value.id, ids: params})
  handleResult(res)
}

// 分配部门
const showAssignDept = async (record: any) => {
  item.value = record
  // 此用户已有dept id
  ids.value = (await listDeptIdsByUser(record.id)).data || []
  deptVisible.value = true
}

const handleAssignDept = async (params: any) => {
  const res = await assignDept({id: item.value.id, ids: params})
  handleResult(res)
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped lang="stylus"></style>

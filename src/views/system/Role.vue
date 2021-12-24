<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'role:list')">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="name">
          <a-input v-model:value="formState.name" placeholder="角色名称" />
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
        <a-button type="primary" @click="roleList">查询</a-button>
      </a-col>
      <a-col>
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'role:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增角色
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
    v-if="checkPerms(actions, 'role:list')"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'action'">
        <a-tag color="purple">{{ record.action }}</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button danger @click="showAssignUser(record)" v-if="checkPerms(actions, 'role:assign_user')">用户 </a-button>
          <a-button danger @click="showAssignMenu(record)" v-if="checkPerms(actions, 'role:assign_menu')">菜单 </a-button>
          <a-button type="primary" @click="showModal('update', record)" v-if="checkPerms(actions, 'role:update')">更新 </a-button>
          <a-button danger type="primary" @click="handleDeleteRole(record)" v-if="checkPerms(actions, 'role:delete')">删除 </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <RoleModal
    :visible="visible"
    :mode="mode"
    :item="item"
    :tenants="tenants"
    @handleSelectKeys="handleSelectKeys"
    @handleOk="handleAddOrUpdateRole"
    @handleCancel="handleModalCancel"
  />
  <AssignMenuModal :visible="menuVisible" :item="item" :ids="ids" @handleSelectKeys="handleSelectKeys" @handleOk="handleAssignMenu" @handleCancel="handleModalCancel" />
  <AssignUserModal :visible="userVisible" :item="item" :ids="ids" @handleSelectKeys="handleSelectKeys" @handleOk="handleAssignUser" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {message} from 'ant-design-vue'
import {add, assignMenu, assignUser, del, list, update} from '@/api/system/role'
import {listMenuByRole} from '@/api/system/menu'
import {listByRole} from '@/api/system/user'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import {listAll as listAllTenants} from '@/api/system/tenant'
import RoleModal from '@/components/modal/system/RoleModal.vue'
import {useStore} from 'vuex'
import AssignMenuModal from '@/components/modal/system/AssignMenuModal.vue'
import AssignUserModal from '@/components/modal/system/AssignUserModal.vue'
import {UserType} from '@/util/const'
import _ from 'lodash'

interface FormState {
  name?: string
  tenant_id: string
}

let columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
  },
  {
    title: '权限字段',
    key: 'action',
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
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
const menuVisible = ref(false)
const userVisible = ref(false)
const item = ref()
const tenants = ref([])
const ids = ref<Array<string>>([])

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  roleList()
}

const roleList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    name: formState.name,
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

checkPerms(actions, 'role:list') && roleList()

// 删除角色
const handleDeleteRole = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => roleList(), 800)
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
  menuVisible.value = false
  userVisible.value = false
}

const handleAddOrUpdateRole = async (param: any) => {
  if (param.id && param.id !== '') {
    const res = await update(param)
    handleResult(res)
  } else {
    const res = await add(param)
    handleResult(res)
  }
}

// 选择key
const handleSelectKeys = (keys: Array<string>) => {
  ids.value = keys
}

// 分配菜单
const showAssignMenu = async (record: any) => {
  item.value = record
  // 此角色已有菜单id
  ids.value = (await listMenuByRole(record.id)).data || []
  menuVisible.value = true
}

const handleAssignMenu = async (params: any) => {
  const res = await assignMenu({id: item.value.id, ids: params})
  handleResult(res)
}

// 分配用户
const showAssignUser = async (record: any) => {
  item.value = record
  // 此角色已有用户id
  ids.value = (await listByRole(record.id)).data || []
  userVisible.value = true
}

const handleAssignUser = async (params: any) => {
  const res = await assignUser({id: item.value.id, ids: params})
  handleResult(res)
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    message.success('success')
    handleModalCancel()
    roleList()
  }
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped lang="stylus"></style>

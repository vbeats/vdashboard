<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'dept:list') && user.type === adminType">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="tenant_id">
          <a-select v-model:value="formState.tenant_id" placeholder="选择租户">
            <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col>
        <a-button type="primary" @click="deptList">查询</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'dept:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增部门
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
    v-if="checkPerms(actions, 'dept:list')"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'type'">
        <a-tag v-if="record.type === 0" color="#108ee9">公司部门</a-tag>
        <a-tag v-else-if="record.type === 1" color="#87d068">机构/公司</a-tag>
        <a-tag v-else-if="record.type === 2" color="#2db7f5">小组</a-tag>
        <a-tag v-else color="#87d068">其它</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button danger @click="showAssignUser(record)" v-if="checkPerms(actions, 'dept:assign_user')">用户 </a-button>
          <a-button type="primary" @click="showModal('update', record)" v-if="checkPerms(actions, 'dept:update')">更新</a-button>
          <a-button danger type="primary" @click="handleDeleteDept(record)" v-if="checkPerms(actions, 'dept:delete')">删除 </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <DeptModal
    :visible="visible"
    :mode="mode"
    :item="item"
    :tenants="tenants"
    :dept-list="datasource"
    @handleSelectKeys="handleSelectKeys"
    @handleOk="handleAddOrUpdateDept"
    @handleCancel="handleModalCancel"
  />
  <AssignUserModal :visible="userVisible" :item="item" :ids="ids" @handleSelectKeys="handleSelectKeys" @handleOk="handleAssignUser" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {message} from 'ant-design-vue'
import {add, assignUser, del, list, update} from '@/api/system/dept'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import {listAll as listAllTenants} from '@/api/system/tenant'
import {useStore} from 'vuex'
import DeptModal from '@/components/modal/system/DeptModal.vue'
import {listByDept} from '@/api/system/user'
import AssignUserModal from '@/components/modal/system/AssignUserModal.vue'
import {UserType} from '@/util/const'
import _ from 'lodash'

interface FormState {
  tenant_id: string
}

let columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '顺序',
    dataIndex: 'sort',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '联系人',
    dataIndex: 'contact_name',
  },
  {
    title: '联系方式',
    dataIndex: 'contact_phone',
  },
  {
    title: '备注',
    dataIndex: 'remark',
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
const formState: UnwrapRef<FormState> = reactive({tenant_id: ''})
const datasource = ref([])
const loading = ref(false)
const mode = ref('add')
const visible = ref(false)
const userVisible = ref(false)
const item = ref()
const tenants = ref([])
const ids = ref<Array<string>>([])

const deptList = () => {
  if (!formState.tenant_id) {
    formState.tenant_id = user.tenant_id
  }
  loading.value = true
  list({id: formState.tenant_id}).then((res) => {
    loading.value = false
    datasource.value = res.data
  })
}

const tenantList = async () => {
  const res = await listAllTenants()
  tenants.value = res.data
  formState.tenant_id = user.tenant_id
}

tenantList()

checkPerms(actions, 'dept:list') && deptList()

// 删除角色
const handleDeleteDept = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => deptList(), 800)
  }
}

const showModal = async (t: string, record: any = {}) => {
  mode.value = t
  item.value = record
  visible.value = true
}

const handleModalCancel = () => {
  item.value = {}
  ids.value = []
  visible.value = false
  userVisible.value = false
}

// 更新
const handleAddOrUpdateDept = async (param: any) => {
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

// 分配用户
const showAssignUser = async (record: any) => {
  item.value = record
  // 此部门已有用户id
  ids.value = (await listByDept(record.id)).data || []
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
    deptList()
  }
}
</script>

<style scoped lang="stylus"></style>

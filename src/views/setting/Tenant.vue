<template>
  <!--  查询租户 -->
  <a-form
    ref="formRef"
    :model="formState">
    <a-row>
      <a-col :span="4">
        <a-form-item name="name">
          <a-input v-model:value="formState.name" placeholder="租户名" @keyup.enter="tenantList"/>
        </a-form-item>
      </a-col>
      <a-col :offset="1">
        <a-button type="primary" @click="tenantList" >查询</a-button>
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
    新增租户
  </a-button>
  <!--table-->
  <a-table :columns="columns"
           :data-source="datasource"
           :loading="loading"
           :pagination="{total,current,pageSize}"
           :row-key="record => record.id"
           bordered class="mt-8" @change="handleTableChange"
  >
    <template #status="{ record }">
      <a-tag v-if="!record.delete_time||record.delete_time===''" color="#87d068">正常</a-tag>
      <a-tag v-else color="#f50">禁用</a-tag>
    </template>
    <template #operation="{ record }">
      <a-space>
        <a-button type="primary" @click="showUpdateModal(record)">更新</a-button>
        <a-button type="danger" @click="handleDeleteTenant(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
  <!--  modal -->
  <tenant-modal :action="action" :data="item" :visible="visible" @cancel="handleModalCancel"
               @handleAddOrUpdateTenant="handleAddOrUpdateTenant"/>

</template>

<script lang="ts" setup>
import { PlusCircleOutlined } from '@ant-design/icons-vue'
import { reactive, ref, UnwrapRef } from 'vue'
import { TableState } from 'ant-design-vue/es/table/interface'
import { message } from 'ant-design-vue'
import { addTenant, delTenant, getTenantList, updateTenant } from '@/api/setting'
import TenantModal from '@/components/modal/setting/TenantModal.vue'

type Pagination = TableState['pagination']

interface FormState {
  name?: string,
}

const columns = [
  {
    title: '租户名',
    dataIndex: 'name'
  },
  {
    title: '租户编号',
    dataIndex: 'code'
  },
  {
    title: '状态',
    align: 'center',
    slots: { customRender: 'status' }
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

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  tenantList()
}

const tenantList = () => {
  loading.value = true
  getTenantList({
    current: current.value,
    page_size: pageSize.value,
    name: formState.name
  }).then(res => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

tenantList()

// 删除租户
const handleDeleteTenant = async (record: any) => {
  const res = await delTenant({ id: record.id })
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => tenantList(), 800)
  }
}

const showUpdateModal = async (record: any) => {
  action.value = 'update'
  item.value = record
  visible.value = true
}

const showAddModal = async () => {
  action.value = 'add'
  item.value = {}
  visible.value = true
}

const handleModalCancel = () => {
  item.value = {}
  visible.value = false
}

const handleAddOrUpdateTenant = async (param: any) => {
  if (param.id && param.id !== '') {
    const res = await updateTenant(param)
    handleResult(res)
  } else {
    const res = await addTenant(param)
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    message.success('success')
    handleModalCancel()
    tenantList()
  }
}

const reset = () => {
  formRef.value.resetFields()
}

</script>

<style lang="stylus" scoped>

</style>

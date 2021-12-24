<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'tenant:list')">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="name">
          <a-input v-model:value="formState.name" placeholder="租户名" />
        </a-form-item>
      </a-col>
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="code">
          <a-input v-model:value="formState.code" placeholder="租户编号" />
        </a-form-item>
      </a-col>
      <a-col>
        <a-button type="primary" @click="tenantList">查询</a-button>
      </a-col>
      <a-col>
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'tenant:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增租户
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
    v-if="checkPerms(actions, 'tenant:list')"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'status'">
        <a-tag v-if="record.status" color="#87d068">正常</a-tag>
        <a-tag v-else color="red">禁用</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button type="primary" @click="showModal('update', record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'tenant:update')"
            >更新
          </a-button>
          <a-button danger @click="updateStatus(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'tenant:disable')">
            {{ record.status ? '禁用' : '启用' }}
          </a-button>
          <a-button
            danger
            type="primary"
            @click="handleDeleteTenant(record)"
            :disabled="record.delete_time && record.delete_time !== ''"
            v-if="checkPerms(actions, 'tenant:delete')"
            >删除
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <TenantModal :visible="visible" :mode="mode" :item="item" @handleOk="handleAddOrUpdateTenant" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {message} from 'ant-design-vue'
import {add, del, list, update, updateStatus as updateTenantStatus} from '@/api/system/tenant'
import TenantModal from '@/components/modal/system/TenantModal.vue'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'

interface FormState {
  name?: string
  code?: string
}

const columns = [
  {
    title: '租户名称',
    dataIndex: 'name',
  },
  {
    title: '租户编号',
    dataIndex: 'code',
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
    title: '状态',
    align: 'center',
    key: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
  },
]

const actions: Array<string> = useRoute().meta.actions as Array<string>

const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({})
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const mode = ref('add')
const visible = ref(false)
const item = ref()

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  tenantList()
}

const tenantList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    name: formState.name,
    code: formState.code,
  }).then((res) => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

checkPerms(actions, 'tenant:list') && tenantList()

// 删除租户
const handleDeleteTenant = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => tenantList(), 800)
  }
}

const updateStatus = async (record: any) => {
  const res = await updateTenantStatus(record.id)
  if (res.code === 200) {
    message.success('更新成功')
    setTimeout(() => tenantList(), 800)
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
  visible.value = false
}

const handleAddOrUpdateTenant = async (param: any) => {
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
    tenantList()
  }
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped lang="stylus"></style>

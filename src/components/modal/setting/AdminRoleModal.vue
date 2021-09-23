<template>
  <a-modal :visible="visible" :width="500" destroy-on-close title="分配角色"
           @cancel="handleCancel"
           @ok="handleOk">
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="{total,current,pageSize}"
      :row-key="record => record.id"
      :row-selection="{ selectedRowKeys: selectedKeys, onChange: onSelectChange }"
      bordered
      @change="handleTableChange"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { TableState } from 'ant-design-vue/es/table/interface'
import { getRoleList } from '@/api/setting'

type Pagination = TableState['pagination']

const emit = defineEmits(['cancel', 'selectKeysChange', 'updateAdminRole'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  selectedKeys: {
    type: Array,
    required: false
  },
  tenantName: {
    type: String,
    required: true
  }
})

const loading = ref(false)
const data = ref([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)

const columns = [
  {
    title: '角色名',
    dataIndex: 'role_name'
  },
  {
    title: '所属租户',
    dataIndex: 'tenant_name'
  }
]

const roleList = () => {
  loading.value = true
  getRoleList({
    current: current.value,
    page_size: pageSize.value,
    tenant_name: props.tenantName
  }).then(res => {
    data.value = res.data.rows
    total.value = res.data.total
    loading.value = false
  })
}

watchEffect(() => {
  const tenantName = props.tenantName
  if (tenantName) {
    roleList()
  }
})

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  roleList()
}

const onSelectChange = (keys: any) => {
  emit('selectKeysChange', keys)
}

const handleCancel = () => {
  current.value = 1
  pageSize.value = 10
  emit('cancel')
}

const handleOk = () => {
  current.value = 1
  pageSize.value = 10
  emit('updateAdminRole')
}

</script>

<style lang="stylus" scoped>

</style>

<template>
  <a-modal :visible="visible" :width="500" destroy-on-close title="分配用户"
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
import { defineEmits, defineProps, ref } from 'vue'
import { getAdminList } from '@/api/setting'
import { TableState } from 'ant-design-vue/es/table/interface'

type Pagination = TableState['pagination']

const emit = defineEmits(['cancel', 'selectKeysChange', 'updateRoleAdmin'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  selectedKeys: {
    type: Array,
    required: false
  }
})

const loading = ref(false)
const data = ref([])
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)

const columns = [
  {
    title: '用户名',
    dataIndex: 'username'
  }
]

const adminList = () => {
  loading.value = true
  getAdminList({
    current: current.value,
    page_size: pageSize.value
  }).then(res => {
    data.value = res.data.rows
    total.value = res.data.total
    loading.value = false
  })
}

adminList()

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  adminList()
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
  emit('updateRoleAdmin')
}

</script>

<style lang="stylus" scoped>

</style>

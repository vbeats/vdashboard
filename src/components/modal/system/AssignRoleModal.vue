<template>
  <a-modal :visible="visible" title="分配角色" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-table
      :columns="columns"
      :data-source="datasource"
      :row-selection="rowSelection"
      :row-key="(record) => record.id"
      :pagination="{total, current, pageSize}"
      :loading="loading"
      @change="handleTableChange"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, ref, toRaw, watchEffect} from 'vue'
import {list} from '@/api/system/role'
import {useStore} from 'vuex'

interface DataItem {
  id: string
  title: string
  type: number
  children?: DataItem[]
}

const emit = defineEmits(['handleSelectKeys', 'handleOk', 'handleCancel'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: false,
  },
  ids: {
    type: Array,
    required: true,
  },
})

const columns = [
  {
    title: '角色',
    dataIndex: 'name',
  },
  {
    title: '权限字段',
    dataIndex: 'action',
  },
]

const user = useStore().getters.getUserInfo
const selectedIds = ref()
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const loading = ref(false)
const datasource = ref([])

const roleList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    tenant_id: props.item?.tenant_id || user.tenant_id,
  }).then((res) => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

watchEffect(() => {
  if (props.visible) {
    selectedIds.value = props.ids
    roleList()
  } else {
    selectedIds.value = undefined
    datasource.value = []
    total.value = 0
    current.value = 1
    pageSize.value = 10
  }
})

const rowSelection = ref({
  checkStrictly: false,
  selectedRowKeys: selectedIds,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    emit('handleSelectKeys', selectedRowKeys)
  },
})

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  roleList()
}

const handleOk = () => {
  emit('handleOk', toRaw(selectedIds.value))
}

const handleCancel = () => {
  emit('handleCancel')
}
</script>

<style scoped lang="stylus"></style>

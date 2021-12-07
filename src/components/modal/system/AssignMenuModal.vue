<template>
  <a-modal :visible="visible" title="分配菜单" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-table :columns="columns" :data-source="datasource" :row-selection="rowSelection" :row-key="(record) => record.id" :loading="loading">
      <template #bodyCell="{column, record}">
        <template v-if="column.key === 'type'">
          <a-tag v-if="record.type === 0" color="#108ee9">菜单</a-tag>
          <a-tag v-else color="#87d068">按钮</a-tag>
        </template>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, ref, toRaw, watchEffect} from 'vue'
import {list} from '@/api/system/menu'

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
    title: '菜单',
    dataIndex: 'title',
  },
  {
    title: '类型',
    key: 'type',
  },
  {
    title: '权限字段',
    dataIndex: 'action',
  },
]

const selectedIds = ref()
const loading = ref(false)
const datasource = ref([])

const menuList = () => {
  loading.value = true
  list({type: 1}).then((res) => {
    loading.value = false
    datasource.value = res.data
  })
}

watchEffect(() => {
  if (props.visible) {
    selectedIds.value = props.ids
    menuList()
  } else {
    selectedIds.value = undefined
    datasource.value = []
  }
})

const rowSelection = ref({
  checkStrictly: false,
  selectedRowKeys: selectedIds,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    emit('handleSelectKeys', selectedRowKeys)
  },
})

const handleOk = () => {
  emit('handleOk', toRaw(selectedIds.value))
}

const handleCancel = () => {
  emit('handleCancel')
}
</script>

<style scoped lang="stylus"></style>

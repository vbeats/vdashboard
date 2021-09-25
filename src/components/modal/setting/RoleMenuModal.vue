<template>
  <a-modal :visible="visible" :width="500" destroy-on-close title="分配菜单"
           @cancel="handleCancel"
           @ok="handleOk">
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="{total,current,pageSize}"
      :row-key="record => record.id"
      :row-selection="{ selectedRowKeys: menus, onChange: onSelectChange }"
      bordered
      @change="handleTableChange"
    >
      <template #menu="{record}">
        {{ record.p_id === 0 ? record.title : '&nbsp;&nbsp;&nbsp;&nbsp;' + record.title }}
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, ref, watchEffect } from 'vue'
import { getMenuList } from '@/api/setting'
import { TableState } from 'ant-design-vue/es/table/interface'

type Pagination = TableState['pagination']

const emit = defineEmits(['cancel', 'handleUpdateSelectMenu', 'handleUpdateRoleMenu'])
const props = defineProps({
  visible: {
    type: Boolean,
    required: false
  },
  menus: {
    type: Array,
    required: false
  },
  tenantId: {
    type: String,
    required: true
  }
})
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const data = ref([])

const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  emit('handleUpdateRoleMenu')
}
const columns = [
  {
    title: '菜单',
    dataIndex: 'title',
    slots: { customRender: 'menu' }
  }
]

const menuList = () => {
  loading.value = true
  getMenuList({
    current: current.value,
    page_size: pageSize.value,
    tenant_id: props.tenantId
  }).then(res => {
    loading.value = false
    data.value = res.data.rows
    total.value = res.data.total
  })
}

watchEffect(() => {
  const tenantId = props.tenantId
  if (tenantId && tenantId !== '') {
    menuList()
  } else {
    data.value = []
  }
})

const handleTableChange = (page: Pagination) => {
  current.value = page?.current || 1
  pageSize.value = page?.pageSize || 10
  menuList()
}

const onSelectChange = (keys: any) => {
  emit('handleUpdateSelectMenu', keys)
}
</script>

<style lang="stylus" scoped>

</style>

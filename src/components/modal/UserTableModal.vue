<template>
  <a-modal :visible="visible" title="分配用户" @ok="handleOk" @cancel="handleCancel">
    <a-table bordered
             :columns="columns"
             :row-key="record => record.id"
             :data-source="datasource"
             :pagination="{total,current,pageSize}"
             :loading="loading"
             @change="handleTableChange" :row-selection="rowSelection"
    ></a-table>
  </a-modal>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watchEffect} from 'vue'
import {ColumnProps, TableState} from 'ant-design-vue/es/table/interface'

type Key = ColumnProps['key'];

type Pagination = TableState['pagination']

interface DataItem {
  key: Key,
  id: number,
  username: string,
  role_name?: string
}

export default defineComponent({
  name: "UserTableModal",
  emits: ['handleCancel', 'handleTableChange'],
  props: {
    loading: Boolean,
    datasource: {type: Array, required: true},
    total: Number,
    current: Number,
    pageSize: Number,
    visible: Boolean,
    currentRoleName: String
  },
  setup(props, {emit}) {

    const selectKeys = ref<Key[]>([])

    const handleCancel = () => {
      emit('handleCancel')
    }

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
    ]

    const handleTableChange = (page: Pagination) => {
      emit('handleTableChange', page)
    }

    watchEffect(() => {
      const items = props.datasource
      items?.forEach((i: any) => {
        if (i.role_name && i.role_name === props.currentRoleName) {
          selectKeys.value.push(i.id)
        }
      })
    })

    const changeSelectKeys = (selected: boolean, rows: DataItem[]) => {
      rows.forEach((record: DataItem) => {
        if (selected && selectKeys.value.indexOf(record.id) < 0) {
          selectKeys.value.push(record.id)
        } else if (!selected && selectKeys.value.indexOf(record.id) >= 0) {
          selectKeys.value.splice(selectKeys.value.indexOf(record.id), 1)
        }
      })
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: selectKeys,
        onSelect: (record: DataItem, selected: boolean, rows: DataItem[]) => {
          changeSelectKeys(selected, [record])
        },
        onSelectAll: (selected: boolean, rows: DataItem[], changeRows: DataItem[]) => {
          changeSelectKeys(selected, changeRows)
        },
      }
    })

    return {
      handleCancel, columns, handleTableChange, rowSelection, selectKeys
    }
  }
})
</script>

<style scoped>

</style>
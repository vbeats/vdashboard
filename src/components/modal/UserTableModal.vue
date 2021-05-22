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
import {computed, defineComponent, ref, unref, watch} from 'vue'
import {TableState} from 'ant-design-vue/es/table/interface'
import _ from "lodash";

type Pagination = TableState['pagination']
type Keys = Array<number>

interface DataItem {
  id: number,
  username: string,
  role_name?: string
}

export default defineComponent({
  name: "UserTableModal",
  emits: ['handleCancel', 'handleTableChange', 'handleOk'],
  props: {
    loading: Boolean,
    datasource: {type: Array, required: true},
    total: Number,
    current: Number,
    pageSize: Number,
    visible: Boolean,
    currentRoleName: String,
    selectedKeys: {type: Array, required: true},
  },
  setup(props, {emit}) {
    const selectedKeys = ref<number[]>([])
    const unSelectedKeys = ref<number[]>([])

    watch(() => props.selectedKeys, (v: any) => {
      selectedKeys.value = v || []
    })

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

    const changeSelectKeys = (selected: boolean, rows: DataItem[]) => {
      rows.forEach((record: DataItem) => {
        if (selected) {
          selectedKeys.value = _.union(selectedKeys.value, [record.id])
          _.remove(unSelectedKeys.value, i => i === record.id)
        } else {
          unSelectedKeys.value = _.union(unSelectedKeys.value, [record.id])
          _.remove(selectedKeys.value, i => i === record.id)
        }
      })
    }

    const rowSelection = computed(() => {
      return {
        selectedRowKeys: unref(selectedKeys),
        onSelect: (record: DataItem, selected: boolean, rows: DataItem[]) => {
          changeSelectKeys(selected, [record])
        },
        onSelectAll: (selected: boolean, rows: DataItem[], changeRows: DataItem[]) => {
          changeSelectKeys(selected, changeRows)
        },
      }
    })

    const handleOk = () => {
      emit('handleOk', {keys: selectedKeys.value, unKeys: unSelectedKeys.value})
    }

    return {
      handleCancel, columns, handleTableChange, rowSelection, handleOk
    }
  }
})
</script>

<style scoped>

</style>
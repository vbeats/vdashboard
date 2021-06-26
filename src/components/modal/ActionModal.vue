<template>
  <a-modal :visible="visible" :width="1000" title="菜单权限" @ok="handleOk" @cancel="handleCancel" destroy-on-close>
    <a-table :columns="columns" :data-source="datasource" :row-key="record=>record.key"
             default-expand-all-rows :pagination="false">
      <template #actions="{text,record}">
        <a-checkbox-group v-model:value="record.checked" :options="record.options"
                          @change="onCheckedChange(record,$event)">
          <template #label="{ value }">
            {{ value }}
          </template>
        </a-checkbox-group>
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import _ from "lodash";

interface Item {
  label: string,
  value: string,
  checked: Array<string>
}

interface ChangedItem {
  key: string,
  actions: Array<string>
}

export default defineComponent({
  name: "ActionModal",
  emits: ['handleCancel', 'handleOk'],
  props: {
    visible: {
      type: Boolean, required: true
    },
    datasource: {type: Array, required: true}
  },
  setup(props, {emit}) {

    const changedItems = ref<Array<ChangedItem>>([])

    const columns = [
      {
        title: '菜单',
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: '权限',
        dataIndex: 'actions',
        width: '80%',
        key: 'actions',
        slots: {customRender: 'actions'}
      },
    ]

    const onCheckedChange = (record: any, e: any) => {
      const key: string = record.key
      const items: Array<ChangedItem> = changedItems.value
      _.remove(items, i => i.key === key)
      items.push({key, actions: e})
      changedItems.value = items
    }


    const handleCancel = () => {
      emit('handleCancel')
    }

    const handleOk = () => {
      emit('handleOk', changedItems.value)
      changedItems.value = []
    }

    return {
      handleOk, handleCancel, columns, onCheckedChange
    }
  }
})
</script>

<style scoped>

</style>
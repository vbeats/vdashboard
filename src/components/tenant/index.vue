<template>
  <el-scrollbar height="820px">
    <avue-tree :loading="loading" :option="option" @node-click="nodeClick">
    </avue-tree>
  </el-scrollbar>
</template>

<script lang="ts" setup>

import {ref} from "vue"
import _ from "lodash"
import {useTenantStore} from "../../store/tenant";
import {listTenantTree, sub} from "../../api/tenant";

const tenantStore = useTenantStore()
const loading = ref(false)
const tenants = ref<Array<any>>([])

const emit = defineEmits(['changeTenant'])

const option = ref({
  lazy: true,
  menu: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  props: {
    label: 'tenantName',
    value: 'id',
    children: 'children'
  },
  treeLoad: async (node: any, resolve: any) => {
    switch (node.level) {
      case 0:
        return resolve(_.map(tenants.value, (item: any) => ({
          ...item, leaf: !item.hasChildren
        })))
      default:
        const id = node.data.id
        const res = await sub({pid: id})
        return resolve(res.data || [])
    }
  }
})

const listTenant = async () => {
  loading.value = true
  const res = await listTenantTree()
  tenants.value = res.data || []
  if (tenants.value.length === 1 && !tenants.value[0].hasChildren) {
    tenantStore.update({tenantId: tenants.value[0].id, tenantName: tenants.value[0].tenantName, show: false})
  }
  loading.value = false
}

await listTenant()

const nodeClick = (node: any) => {
  emit('changeTenant', {tenantId: node.id})
  tenantStore.update({tenantId: node.id, tenantName: node.tenantName})
}
</script>

<style lang="stylus" scoped>
.avue-tree
  :deep(.el-input-group__append)
    display none !important
</style>
<template>
  <avue-tree :loading="loading" :option="option" @node-click="nodeClick">
  </avue-tree>
</template>

<script setup lang="ts">

import {ref} from "vue"
import {listV2, sub} from "../../api/tenant"
import _ from "lodash"
import {useTenantStore} from "../../store/tenant"

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
    label: 'tenant_name',
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
  const res = await listV2()
  tenants.value = res.data || []
  if (tenants.value.length === 1 && !tenants.value[0].hasChildren) {
    tenantStore.update({tenant_id: tenants.value[0].id, tenant_name: tenants.value[0].tenant_name, show: false})
  }
  loading.value = false
}

await listTenant()

const nodeClick = (node: any) => {
  emit('changeTenant', {tenant_id: node.id})
  tenantStore.update({tenant_id: node.id, tenant_name: node.tenant_name})
}
</script>

<style scoped lang="stylus">
.avue-tree
  :deep(.el-input-group__append)
    display none !important
</style>
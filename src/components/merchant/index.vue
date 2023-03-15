<template>
  <el-scrollbar height="820px">
    <avue-tree :loading="loading" :option="option" @node-click="nodeClick">
    </avue-tree>
  </el-scrollbar>
</template>

<script lang="ts" setup>

import {ref} from "vue"
import _ from "lodash"
import {useMerchantStore} from "../../store/merchant";
import {listMerchantTree, sub} from "../../api/merchant";

const merchantStore = useMerchantStore()
const loading = ref(false)
const merchants = ref<Array<any>>([])

const emit = defineEmits(['changeMerchant'])

const option = ref({
  lazy: true,
  menu: false,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  props: {
    label: 'merchantName',
    value: 'id',
    children: 'children'
  },
  treeLoad: async (node: any, resolve: any) => {
    switch (node.level) {
      case 0:
        return resolve(_.map(merchants.value, (item: any) => ({
          ...item, leaf: !item.hasChildren
        })))
      default:
        const id = node.data.id
        const res = await sub({pid: id})
        return resolve(res.data || [])
    }
  }
})

const listMerchant = async () => {
  loading.value = true
  const res = await listMerchantTree()
  merchants.value = res.data || []
  if (merchants.value.length === 1 && !merchants.value[0].hasChildren) {
    merchantStore.update({merchantId: merchants.value[0].id, merchantName: merchants.value[0].merchantName, show: false})
  }
  loading.value = false
}

await listMerchant()

const nodeClick = (node: any) => {
  emit('changeMerchant', {merchantId: node.id})
  merchantStore.update({merchantId: node.id, merchantName: node.merchantName})
}
</script>

<style lang="stylus" scoped>
.avue-tree
  :deep(.el-input-group__append)
    display none !important
</style>
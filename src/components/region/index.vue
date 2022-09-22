<template>
  <el-scrollbar height="820px">
    <el-tree :data="regions" :props="props" :load="loadSubRegion" lazy/>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import {list} from "../../api/region"
import {ref} from "vue"
import type Node from 'element-plus/es/components/tree/src/model/node'
import _ from "lodash";


const regions = ref([])

const props = {
  label: 'name',
}

const listRegion = async (pid: string = '0') => {
  const res = await list({pid})
  regions.value = res.data || []
}

await listRegion()

const loadSubRegion = async (node: Node, resolve: (data: any) => void) => {
  switch (node.level) {
    case 0:
      return resolve(_.map(regions.value, (item: any) => ({
        ...item, leaf: !item.hasChildren
      })))
      break
    default:
      const pid = node.data.id
      const res = await list({pid})
      return resolve(res.data || [])
  }
}

</script>

<style scoped lang="stylus">

</style>
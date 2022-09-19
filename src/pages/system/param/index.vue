<template>
  <avue-crud :data="configs" v-model:search="search" :option="option" v-model:page="page"
             :permission="permission" :table-loading="loading"
             @refresh-change="listConfig" @search-change="listConfig"
             @size-change="listConfig" @current-change="listConfig"
             @row-save="addConfig" @row-update="updateConfig" @row-del="delConfig"
  >

  </avue-crud>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {add, del, list, update} from "../../../api/config"
import checkPerms from "../../../util/checkPerms"
import {ElMessage} from "element-plus";
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const configs = ref([])
const search = ref({
  config_key: ''
})

const loading = ref(false)

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listConfig = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, page_size: page.value.pageSize, config_key: search.value.config_key})
  configs.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listConfig()

const addConfig = async (row: any, done: any, loading: any) => {
  await add(row)
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listConfig()
  }, 800)
}

const updateConfig = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listConfig()
  }, 800)
}

const delConfig = async (row: any, index: any) => {
  await del(row)
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    await listConfig()
  }, 800)
}

const permission = ref({
  addBtn: checkPerms(route, 'add'),
  editBtn: checkPerms(route, 'edit'),
  delBtn: checkPerms(route, 'del'),
})

const option = ref({
  border: true,
  dialogWidth: '50%',
  column: [
    {
      label: '配置项',
      prop: 'config_key',
      search: true,
      rules: [
        {required: true, message: 'key不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '值',
      prop: 'config_value',
      overHidden: true,
      rules: [
        {required: true, message: '值不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      overHidden: true,
    },
    {
      label: '创建时间',
      prop: 'create_time',
      width: 160,
      display: false
    },
    {
      label: '更新时间',
      prop: 'update_time',
      width: 160,
      hide: true,
      display: false
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
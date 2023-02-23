<template>
  <avue-crud ref="crud" v-model:page="page" v-model:search="search" :before-close="beforeClose"
             :data="tenants" :option="option" :permission="permission"
             :table-loading="loading" @tree-load="loadSub"
             @refresh-change="listTenant" @search-change="listTenant"
             @size-change="listTenant" @current-change="listTenant"
             @row-save="addTenant" @row-update="updateTenant"
             @selection-change="selectList"
  >
    <template v-if="checkPerms(route,'admin.tenant.addsub')" #menu="{type,size,row}">
      <el-button :size="size" :type="type" icon="el-icon-arrow-down" text @click.stop="addSub(row)">新增子级</el-button>
    </template>
  </avue-crud>
</template>

<script lang="ts" name="tenant" setup>
import {ref} from "vue"
import {add, list, sub, update} from "../../../api/tenant"
import {checkPerms} from "../../../util/permission"
import {ElMessage} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const crud = ref()

const tenants = ref([])
const search = ref({
  code: '',
  tenantName: ''
})
const loading = ref(true)
const selectRows = ref([])

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listTenant = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, pageSize: page.value.pageSize, code: search.value.code, tenantName: search.value.tenantName})
  tenants.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listTenant()

const selectList = (rows: any) => {
  selectRows.value = rows
}

const addTenant = async (row: any, done: any, loading: any) => {
  const res = await add(row)
  row = {...res.data}
  ElMessage.success({message: '添加成功'})
  done(row)
}

const updateTenant = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  done(row)
}

const loadSub = async (tree: any, node: any, resolve: any) => {
  const res = await sub({pid: tree.id})
  resolve(res.data)
}

const addSub = async (row: any) => {
  option.value.column.filter(v => {
    if (v.prop === 'pid') {
      v.dicData = [{label: row.tenantName, value: row.id}]
      v.value = row.id
    }
  })
  crud.value.rowAdd()
}

const beforeClose = (done: any, type: any) => {
  option.value.column.filter(v => {
    if (v.prop === 'pid') {
      v.dicData = [{label: '无上级', value: 0}]
      v.value = 0
    }
  })
  done()
}

const permission = ref({
  addBtn: checkPerms(route, 'admin.tenant.add'),
  editBtn: checkPerms(route, 'admin.tenant.edit'),
  delBtn: false
})

const option = ref({
  border: true,
  menuWidth: 380,
  dialogWidth: '50%',
  lazy: true,
  selection: true,
  parentId: 'pid',
  rowParentKey: 'pid',
  column: [
    {
      label: '上级租户',
      prop: 'pid',
      hide: true,
      type: 'select',
      value: 0,
      dicData: [{label: '无上级', value: 0}],
      addDisplay: true,
      editDisplay: false,
      disabled: true
    },
    {
      label: '租户编号',
      prop: 'code',
      search: true,
      addDisplay: false,
      editDisplay: true,
      disabled: true
    },
    {
      label: '租户名称',
      prop: 'tenantName',
      search: true,
      overHidden: true,
      rules: [
        {required: true, message: '名称不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      overHidden: true,
    },
    {
      label: '创建时间',
      prop: 'createTime',
      width: 160,
      display: false
    },
    {
      label: '更新时间',
      prop: 'updateTime',
      width: 160,
      hide: true,
      display: false
    }
  ]
})
</script>

<style lang="stylus" scoped>

</style>
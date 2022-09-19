<template>
  <avue-crud :data="tenants" v-model:search="search" :option="option" v-model:page="page"
             :permission="permission" @tree-load="loadSub" :table-loading="loading"
             @refresh-change="listTenant" @search-change="listTenant"
             @size-change="listTenant" @current-change="listTenant"
             @row-save="addTenant" @row-update="updateTenant" @row-del="delTenant"
             @selection-change="selectList" :before-close="beforeClose"
             ref="crud"
  >
    <template #status="scope">
      <el-tag :type="scope.row.status?'':'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
    </template>
    <template #menu-left="{size}">
      <el-button icon="close" :size="size" type="warning" @click.stop="blockTenant" v-if="checkPerms(route,'block')">禁用</el-button>
      <el-button icon="el-icon-check" :size="size" type="success" @click.stop="unBlockTenant" v-if="checkPerms(route,'unblock')">解封</el-button>
    </template>
    <template #menu="{type,size,row}" v-if="checkPerms(route,'addsub')">
      <el-button icon="el-icon-check" text :size="size" :type="type" @click.stop="addSub(row)">新增子级</el-button>
    </template>
  </avue-crud>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {add, block, del, list, sub, unBlock, update} from "../../../api/tenant"
import checkPerms from "../../../util/checkPerms"
import {ElMessage} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const crud = ref()

const tenants = ref([])
const search = ref({
  code: '',
  tenant_name: ''
})
const loading = ref(false)
const selectRows = ref([])

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listTenant = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, page_size: page.value.pageSize, code: search.value.code, tenant_name: search.value.tenant_name})
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
  ElMessage.success({message: '添加成功'})
  row.id = res.data
  done(row)
}

const updateTenant = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  done(row)
}

const delTenant = async (row: any, index: any, done: any) => {
  await del(row)
  ElMessage.success({message: '删除成功'})
  done(row)
}

const loadSub = async (tree: any, node: any, resolve: any) => {
  const res = await sub({pid: tree.id})
  resolve(res.data)
}

const addSub = async (row: any) => {
  option.value.column.filter(v => {
    if (v.prop === 'pid') {
      v.dicData = [{label: row.tenant_name, value: row.id}]
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

const blockTenant = async () => {
  if (selectRows.value.length === 0) {
    ElMessage.warning({message: '请选择至少一条数据'})
    return
  }
  await block(selectRows.value)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    crud.value.refreshTable()
  }, 800)
}


const unBlockTenant = async () => {
  if (selectRows.value.length === 0) {
    ElMessage.warning({message: '请选择至少一条数据'})
    return
  }
  await unBlock(selectRows.value)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    crud.value.refreshTable()
  }, 800)
}

const permission = ref({
  addBtn: checkPerms(route, 'add'),
  editBtn: checkPerms(route, 'edit'),
  delBtn: checkPerms(route, 'del'),
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
      rules: [
        {required: true, message: '编号不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '租户名称',
      prop: 'tenant_name',
      search: true,
      overHidden: true,
      rules: [
        {required: true, message: '名称不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '状态',
      prop: 'status',
      value: true,
      display: false,
      slot: true
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
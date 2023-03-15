<template>
  <avue-crud ref="crud" v-model:page="page" v-model:search="search" :before-close="beforeClose"
             :data="merchants" :option="option" :permission="permission"
             :table-loading="loading" @tree-load="loadSub"
             @refresh-change="listMerchant" @search-change="listMerchant"
             @size-change="listMerchant" @current-change="listMerchant"
             @row-save="addMerchant" @row-update="updateMerchant"
             @selection-change="selectList"
  >
    <template v-if="checkPerms(route,'admin.merchant.addsub')" #menu="{type,size,row}">
      <el-button :size="size" :type="type" icon="el-icon-arrow-down" text @click.stop="addSub(row)">新增子级</el-button>
    </template>
  </avue-crud>
</template>

<script lang="ts" name="merchant" setup>
import {ref} from "vue"
import {add, list, sub, update} from "../../../api/merchant"
import {checkPerms} from "../../../util/permission"
import {ElMessage} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const crud = ref()

const merchants = ref([])
const search = ref({
  code: '',
  merchantName: ''
})
const loading = ref(true)
const selectRows = ref([])

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listMerchant = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, pageSize: page.value.pageSize, code: search.value.code, merchantName: search.value.merchantName})
  merchants.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listMerchant()

const selectList = (rows: any) => {
  selectRows.value = rows
}

const addMerchant = async (row: any, done: any, loading: any) => {
  const res = await add(row)
  row = {...res.data}
  ElMessage.success({message: '添加成功'})
  done(row)
}

const updateMerchant = async (row: any, index: any, done: any, loading: any) => {
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
      v.dicData = [{label: row.merchantName, value: row.id}]
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
  addBtn: checkPerms(route, 'admin.merchant.add'),
  editBtn: checkPerms(route, 'admin.merchant.edit'),
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
      label: '上级商户',
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
      label: '商户编号',
      prop: 'code',
      search: true,
      addDisplay: false,
      editDisplay: true,
      disabled: true
    },
    {
      label: '商户名称',
      prop: 'merchantName',
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
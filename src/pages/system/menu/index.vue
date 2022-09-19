<template>
  <avue-crud :data="menus" :option="option"
             :permission="permission" @tree-load="loadSub" :table-loading="loading"
             @row-save="addTenant" @row-update="updateMenu" @row-del="delMenu"
             :before-close="beforeClose"
             ref="crud"
  >
    <template #type="scope">
      <el-tag :type="scope.row.type===0?'':'success'">{{ scope.row.type === 0 ? '菜单' : '按钮' }}</el-tag>
    </template>
    <template #icon="scope">
      <el-icon>
        <Component :is="scope.row.icon"/>
      </el-icon>
    </template>
    <template #menu="{type,size,row}" v-if="checkPerms(route,'addsub')">
      <el-button icon="el-icon-check" text :size="size" :type="type" @click.stop="addSub(row)">新增子级</el-button>
    </template>
  </avue-crud>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {add, del, list, sub, update} from "../../../api/menu"
import checkPerms from "../../../util/checkPerms"
import {ElMessage} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const crud = ref()

const menus = ref([])

const loading = ref(false)

const listMenu = async () => {
  loading.value = true
  const res = await list()
  menus.value = res.data || []
  loading.value = false
}

await listMenu()

const addTenant = async (row: any, done: any, loading: any) => {
  const res = await add(row)
  ElMessage.success({message: '添加成功'})
  row.id = res.data
  done(row)
}

const updateMenu = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  done(row)
}

const delMenu = async (row: any, index: any, done: any) => {
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
      v.dicData = [{label: row.title, value: row.id}]
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
  addBtn: checkPerms(route, 'add'),
  editBtn: checkPerms(route, 'edit'),
  delBtn: checkPerms(route, 'del'),
})

const option = ref({
  border: true,
  menuWidth: 380,
  dialogWidth: '50%',
  lazy: true,
  parentId: 'pid',
  rowParentKey: 'pid',
  column: [
    {
      label: '上级菜单',
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
      label: '标题',
      prop: 'title',
      rules: [
        {required: true, message: '标题不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '路由',
      prop: 'path',
    },
    {
      label: '图标',
      prop: 'icon',
      slot: true
    },
    {
      label: '唯一标识',
      prop: 'key',
      rules: [
        {required: true, message: 'key不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '类型',
      prop: 'type',
      slot: true,
      type: 'radio',
      dicData: [{label: '菜单', value: 0}, {label: '按钮', value: 1}],
      value: 0,
      rules: [
        {required: true, message: '类型不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '顺序',
      prop: 'sort',
      value: 1
    },
    {
      label: '备注',
      prop: 'remark',
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
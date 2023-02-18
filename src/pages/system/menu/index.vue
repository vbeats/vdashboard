<template>
  <avue-crud ref="menuRef" :before-close="beforeClose"
             :data="menus" :option="option" :permission="permission"
             :table-loading="loading" @tree-load="loadSub" @row-save="addMenu"
             @row-update="updateMenu" @row-del="delMenu"
             @refresh-change="listMenu"
  >
    <template #type="scope">
      <el-tag :type="scope.row.type===0?'':'success'">{{ scope.row.type === 0 ? '菜单' : '按钮' }}</el-tag>
    </template>
    <template #icon="scope">
      <el-icon>
        <Component :is="scope.row.icon"/>
      </el-icon>
    </template>
    <template v-if="checkPerms(route,'admin.menu.addsub')" #menu="{type,size,row}">
      <el-button v-if="row.type===0" :size="size" :type="type" icon="el-icon-check" text @click.stop="addSub(row)">新增子级</el-button>
    </template>
  </avue-crud>
</template>

<script lang="ts" name="menus" setup>
import {ref} from "vue"
import {add, del, list, sub, update} from "../../../api/menu"
import checkPerms from "../../../util/checkPerms"
import {ElMessage} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"

setTitle()

const route = useRoute()
const menuRef = ref()

const menus = ref([])

const loading = ref(true)

const listMenu = async () => {
  loading.value = true
  const res = await list()
  menus.value = res.data || []
  loading.value = false
}

await listMenu()

const addMenu = async (row: any, done: any, loading: any) => {
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
  menuRef.value.rowAdd()
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
  addBtn: checkPerms(route, 'admin.menu.add'),
  editBtn: checkPerms(route, 'admin.menu.edit'),
  delBtn: checkPerms(route, 'admin.menu.del'),
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
      label: '菜单Key',
      prop: 'key'
    },
    {
      label: '权限字段',
      prop: 'permission',
      overHidden: true
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
      ],
      control: (v: any, form: any) => {
        const path = {
          display: true
        }
        const icon = {
          display: true
        }
        const key = {
          display: true
        }
        const permission = {
          display: false
        }
        const sort = {
          display: true
        }
        if (v === 0) {
          path.display = true
          icon.display = true
          key.display = true
          sort.display = true
          permission.display = false
        } else {
          path.display = false
          icon.display = false
          key.display = false
          sort.display = false
          permission.display = true
        }
        return {
          path, icon, key, sort, permission
        }
      }
    },
    {
      label: '顺序',
      prop: 'sort',
      value: 0
    },
    {
      label: '备注',
      prop: 'remark',
    }
  ]
})
</script>

<style lang="stylus" scoped>

</style>
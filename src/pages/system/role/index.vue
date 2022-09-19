<template>
  <avue-crud :data="roles" v-model:search="search" :option="option" v-model:page="page"
             :permission="permission" :table-loading="loading"
             @refresh-change="listRole" @search-change="listRole"
             @size-change="listRole" @current-change="listRole"
             @row-save="addRole" @row-update="updateRole" @row-del="delRole"
  >
    <template #menu="{type,size,row}" v-if="checkPerms(route,'menu')">
      <el-button icon="el-icon-check" text :size="size" :type="type" @click.stop="showMenuModal(row)">菜单配置</el-button>
    </template>
  </avue-crud>

  <el-dialog
      v-model="menuVisible"
      title="菜单配置"
      width="30%"
      :close-on-click-modal="false"
      destroy-on-close
      @opened="afterMenuTreeOpen"
  >
    <el-tree
        ref="menuRef"
        :data="menus"
        show-checkbox
        node-key="id"
        :default-checked-keys="roleMenus"
        highlight-current
        :props="defaultProps"
        :check-strictly="checkStrictly"
    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="menuVisible = false">取消</el-button>
        <el-button type="primary" @click="assignMenu">确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {add, assignRoleMenu, del, list, update} from "../../../api/role"
import {listRoleMenu, menus as listMenus} from "../../../api/menu"
import checkPerms from "../../../util/checkPerms"
import {ElMessage, ElTree} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router";

setTitle()

const route = useRoute()
const roles = ref([])
const search = ref({
  role_name: '',
  code: ''
})
const loading = ref(false)

const checkStrictly = ref(false)
const menus = ref()
const menuRef = ref<InstanceType<typeof ElTree>>()
const menuVisible = ref(false)
const roleMenus = ref([])
const roleId = ref('')

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listRole = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, page_size: page.value.pageSize, role_name: search.value.role_name, code: search.value.code})
  roles.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listRole()

const addRole = async (row: any, done: any, loading: any) => {
  await add(row)
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listRole()
  }, 800)
}

const updateRole = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listRole()
  }, 800)
}

const delRole = async (row: any, index: any) => {
  await del(row)
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    await listRole()
  }, 800)
}

const showMenuModal = async (row: any) => {
  roleId.value = row.id
  const res = await listMenus({is_all: true})
  const r = await listRoleMenu({role_id: roleId.value})
  menus.value = res.data
  checkStrictly.value = true
  roleMenus.value = r.data || []
  menuVisible.value = true
}

const afterMenuTreeOpen = () => {
  checkStrictly.value = false
}

const assignMenu = async () => {
  const nodes = menuRef.value!.getCheckedNodes(false, true)
  const menuIds = nodes.map((e: any) => e.id)
  const res = await assignRoleMenu({role_id: roleId.value, menu_ids: menuIds})
  if (res.code === 200) {
    ElMessage.success({message: '分配成功'})
    menus.value = []
    roleId.value = ''
    roleMenus.value = []
    menuVisible.value = false
  }
}

const defaultProps = {
  children: 'children',
  label: 'title',
}

const permission = ref({
  addBtn: checkPerms(route, 'add'),
  editBtn: checkPerms(route, 'edit'),
  delBtn: checkPerms(route, 'del'),
})
const option = ref({
  border: true,
  menuWidth: 380,
  dialogWidth: '40%',
  column: [
    {
      label: '角色名称',
      prop: 'role_name',
      search: true,
      rules: [
        {required: true, message: '角色名不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '角色编号',
      prop: 'code',
      search: true,
      rules: [
        {required: true, message: '编号不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '备注',
      prop: 'remark',
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
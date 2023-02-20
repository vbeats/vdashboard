<template>
  <avue-crud v-model:page="page" v-model:search="search" :data="roles" :option="option"
             :permission="permission" :table-loading="loading"
             @refresh-change="listRole" @search-change="listRole"
             @size-change="listRole" @current-change="listRole"
             @row-save="addRole" @row-update="updateRole" @row-del="delRole"
  >
    <template v-if="checkPerms(route,'admin.role.menu')" #menu="{type,size,row}">
      <el-button :size="size" :type="type" icon="el-icon-menu" text @click.stop="showMenuModal(row)">菜单配置</el-button>
    </template>
  </avue-crud>

  <el-dialog
      v-model="menuVisible"
      :close-on-click-modal="false"
      destroy-on-close
      title="菜单配置"
      width="30%"
      @opened="afterMenuTreeOpen"
  >
    <el-tree-v2
        ref="menuRef"
        :check-strictly="checkStrictly"
        :data="menus"
        :props="defaultProps"
        :default-expanded-keys="expandMenus"
        :default-checked-keys="roleMenus"
        :height="450"
        highlight-current
        node-key="id"
        show-checkbox
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

<script lang="ts" name="role" setup>
import {ref} from "vue"
import {add, assignRoleMenu, del, list, update} from "../../../api/role"
import {listRoleMenu, menus as listMenus} from "../../../api/menu"
import checkPerms from "../../../util/checkPerms"
import {ElMessage, ElTree} from "element-plus"
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import _ from "lodash";

setTitle()

const route = useRoute()
const roles = ref([])
const search = ref({
  roleName: '',
  action: ''
})
const loading = ref(true)

const checkStrictly = ref(false)
const menus = ref()
const menuRef = ref<InstanceType<typeof ElTree>>()
const menuVisible = ref(false)
const roleMenus = ref<Array<String>>([])
const expandMenus = ref<Array<String>>([])
const roleId = ref('')

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listRole = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, pageSize: page.value.pageSize, roleName: search.value.roleName, action: search.value.action})
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
  const res = await listMenus()
  const r = await listRoleMenu({roleId: roleId.value})
  menus.value = res.data
  checkStrictly.value = true
  roleMenus.value = r.data || []
  expandMenus.value = []
  appendExpendKeys(menus.value)
  menuVisible.value = true
}

const appendExpendKeys = (menus: Array<any>) => {
  menus.forEach(item => {
    if (item.children && item.children.length > 0 && roleMenus.value.includes(item.id)) {
      expandMenus.value.push(item.id)
      appendExpendKeys(item.children)
    }
  })
}

const afterMenuTreeOpen = () => {
  checkStrictly.value = false
}

const assignMenu = async () => {
  const nodes = menuRef.value!.getCheckedNodes(false, true) || []
  const halfNodes = menuRef.value!.getHalfCheckedNodes()
  const menuIds = _.concat(halfNodes, nodes).filter((e: any) => e && e.id).map((e: any) => e.id)
  const res = await assignRoleMenu({roleId: roleId.value, menuIds: menuIds})
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

const validateAction = (rule: any, value: any, callback: any) => {
  if (!value || value.trim() === '') {
    callback(new Error('权限字段不能为空'))
  } else if (['super_admin', 'admin', '*'].includes(value.trim().toLowerCase())) {
    callback(new Error('保留字段 禁止使用'));
  } else {
    callback();
  }
}

const permission = ref({
  addBtn: checkPerms(route, 'admin.role.add'),
  editBtn: checkPerms(route, 'admin.role.edit'),
  delBtn: checkPerms(route, 'admin.role.del'),
})
const option = ref({
  border: true,
  menuWidth: 380,
  dialogWidth: '40%',
  column: [
    {
      label: '角色名称',
      prop: 'roleName',
      search: true,
      rules: [
        {required: true, message: '角色名不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '权限字段',
      prop: 'action',
      search: true,
      rules: [
        {required: true, validator: validateAction, trigger: 'blur'}
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      overHidden: true,
    }
  ]
})
</script>

<style lang="stylus" scoped>

</style>
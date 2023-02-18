<template>
  <el-row>
    <el-col v-show="showTenant" :span="4">
      <el-card>
        <tenant @change-tenant="onTenantChange"/>
      </el-card>
    </el-col>
    <el-col :offset="showTenant?1:0" :span="showTenant?19:24">
      <avue-crud ref="userRef" v-model="form" v-model:page="page" v-model:search="search" :before-open="beforeOpen" :data="admins"
                 :option="option" :permission="permission"
                 :table-loading="loading" @refresh-change="listAdmin"
                 @search-change="listAdmin" @size-change="listAdmin" @current-change="listAdmin"
                 @row-save="addAdmin" @row-update="updateAdmin" @row-del="delAdmin" @selection-change="selectList"
      >
        <template #tenantName="scope">
          <el-tag>{{ scope.row.tenantName }}</el-tag>
        </template>

        <template #status="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
        </template>

        <template #role="scope">
          <el-tag v-if="scope.row.roleName&&scope.row.roleName!==''">{{ scope.row.roleName }}</el-tag>
        </template>

        <template #menu-left="{size}">
          <el-button v-if="checkPerms(route,'admin.user.block')" :size="size" icon="close" type="warning" @click.stop="blockAdmin">禁用</el-button>
          <el-button v-if="checkPerms(route,'admin.user.unblock')" :size="size" icon="el-icon-check" type="success" @click.stop="unBlockAdmin">解封</el-button>
        </template>

        <template #menu="{type,size,row}">
          <el-button v-if="checkPerms(route,'admin.user.resetpwd')" :size="size" :type="type" icon="el-icon-switch" text @click.stop="resetAdminPwd(row)">重置密码</el-button>
          <el-button v-if="checkPerms(route,'admin.user.role')" :size="size" :type="type" icon="el-icon-connection" text @click.stop="showRoleModal(row)">角色配置</el-button>
        </template>
      </avue-crud>
    </el-col>
  </el-row>

  <role :visible="roleVisible" :user-id="currentUserId" @close-role-modal="closeRoleModal" v-if="roleVisible"/>
</template>

<script lang="ts" name="user" setup>
import Tenant from '../../../components/tenant/index.vue'
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import {ref, watchEffect} from "vue";
import {add, block, del, list, resetPwd, unBlock, update} from "../../../api/admin"
import {listTenantTree} from "../../../api/tenant"
import checkPerms from "../../../util/checkPerms"
import {useTenantStore} from "../../../store/tenant"
import {ElMessage} from "element-plus"
import Role from "./role.vue"

setTitle()

const tenantStore = useTenantStore()
const route = useRoute()
const admins = ref([])
const search = ref({
  account: '',
  phone: ''
})

const userRef = ref()
const form = ref()

const loading = ref(true)
const tenantId = ref()
const tenantName = ref()
const showTenant = ref(tenantStore.tenantState.show)
const formType = ref('add')
const selectRows = ref<Array<any>>([])
const currentUserId = ref()

const roleVisible = ref(false)

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listAdmin = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({
    current: page.value.currentPage,
    pageSize: page.value.pageSize,
    tenantId: tenantId.value,
    account: search.value.account,
    phone: search.value.phone
  })
  admins.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listAdmin()

watchEffect(async () => {
  tenantId.value = tenantStore.tenantState.tenantId
  tenantName.value = tenantStore.tenantState.tenantName
  showTenant.value = tenantStore.tenantState.show
})

const onTenantChange = async (param: any) => {
  tenantId.value = param.tenantId
  await listAdmin()
}

const beforeOpen = async (done: any, type: any) => {
  formType.value = type
  if ('add' === type && !tenantId.value) {
    ElMessage.warning({message: '请先选择租户'})
    return
  }
  const res = await listTenantTree()
  option.value.column.filter(v => {
    if (v.prop === 'tenant') {
      v.dicData = [{label: tenantName.value, value: tenantId.value}]
      v.value = tenantName.value
    }
  })
  done && done()
}

const addAdmin = async (row: any, done: any, loading: any) => {
  const res = await add({
    ...row,
    tenantId: tenantId.value,
    password: row.password && row.password !== '' ? row.password : undefined
  })
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listAdmin()
  }, 800)
}

const updateAdmin = async (row: any, index: any, done: any, loading: any) => {
  await update({
    ...row,
    password: row.password && row.password !== '' ? row.password : undefined
  })
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listAdmin()
  }, 800)
}

const delAdmin = async (row: any, index: any, done: any, loading: any) => {
  userRef.value.$confirm(`确定删除${row.account}?`, {type: 'warning'})
      .then(async () => {
        await del({id: row.id})
        ElMessage.success({message: '删除成功'})
        setTimeout(async () => {
          done()
          await listAdmin()
        }, 800)
      }).catch(() => {
  })
}

const blockAdmin = async () => {
  if (selectRows.value.length === 0) {
    ElMessage.warning({message: '请选择至少一条数据'})
    return
  }
  await block(selectRows.value)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    await listAdmin()
  }, 800)
}

const unBlockAdmin = async () => {
  if (selectRows.value.length === 0) {
    ElMessage.warning({message: '请选择至少一条数据'})
    return
  }
  await unBlock(selectRows.value)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    await listAdmin()
  }, 800)
}

const selectList = (rows: any) => {
  selectRows.value = rows
}

const validPassword = (rule: any, value: string, callback: any) => {
  if ('add' === formType.value && (!value || value === '')) {
    callback(new Error('请输入密码'))
  } else {
    callback()
  }
}

const resetAdminPwd = async (row: any) => {
  userRef.value.$confirm(`确定重置${row.account}密码?`, {type: 'warning'})
      .then(async () => {
        await resetPwd(row)
        ElMessage.success({message: '密码重置成功'})
      }).catch(() => {
  })
}

// 角色分配
const showRoleModal = async (row: any) => {
  currentUserId.value = row.id
  roleVisible.value = true
}

const closeRoleModal = () => {
  currentUserId.value = ''
  roleVisible.value = false
}

const permission = ref({
  addBtn: checkPerms(route, 'admin.user.add'),
  editBtn: checkPerms(route, 'admin.user.edit'),
  delBtn: checkPerms(route, 'admin.user.del'),
})
const option = ref({
  border: true,
  menuWidth: 380,
  selection: true,
  dialogWidth: '50%',
  column: [
    {
      label: '所属租户',
      prop: 'tenant',
      type: 'select',
      dicData: [{label: tenantName.value, value: tenantId.value}],
      value: tenantName.value,
      hide: true,
      disabled: true,
      addDisplay: true,
      editDisplay: false,
    },
    {
      label: '账号',
      prop: 'account',
      editDisabled: true,
      search: true,
      rules: [
        {required: true, message: '账号不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '所属租户',
      prop: 'tenantName',
      slot: true,
      disabled: true,
      addDisplay: false,
      editDisplay: true,
    },
    {
      label: '昵称',
      prop: 'nickName'
    },
    {
      label: '密码',
      prop: 'password',
      addDisplay: true,
      editDisplay: true,
      value: '',
      hide: true,
      rules: [
        {validator: validPassword, trigger: 'blur'}
      ]
    },
    {
      label: '手机号',
      prop: 'phone',
      search: true
    },
    {
      label: '状态',
      prop: 'status',
      slot: true,
      value: 1,
      addDisplay: false,
      editDisplay: false
    }
  ]
})
</script>

<style lang="stylus" scoped>

</style>
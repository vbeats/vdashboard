<template>
  <el-row>
    <el-col :span="4" v-show="showTenant">
      <el-card>
        <tenant @change-tenant="onTenantChange"/>
      </el-card>
    </el-col>
    <el-col :span="showTenant?19:24" :offset="showTenant?1:0">
      <avue-crud :data="admins" v-model:search="search" :option="option" v-model:page="page" v-model="form"
                 :permission="permission" :table-loading="loading"
                 @refresh-change="listAdmin" @search-change="listAdmin"
                 @size-change="listAdmin" @current-change="listAdmin" :before-open="beforeOpen"
                 @row-save="addAdmin" @row-update="updateAdmin" @row-del="delAdmin" @selection-change="selectList"
      >
        <template #tenant_name="scope">
          <el-tag>{{ scope.row.tenant_name }}</el-tag>
        </template>

        <template #status="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
        </template>

        <template #role="scope">
          <el-tag v-if="scope.row.role_name&&scope.row.role_name!==''">{{ scope.row.role_name }}</el-tag>
        </template>

        <template #menu-left="{size}">
          <el-button icon="close" :size="size" type="warning" @click.stop="blockAdmin" v-if="checkPerms(route,'user.block')">禁用</el-button>
          <el-button icon="el-icon-check" :size="size" type="success" @click.stop="unBlockAdmin" v-if="checkPerms(route,'user.unblock')">解封</el-button>
        </template>

        <template #menu="{type,size,row}" v-if="checkPerms(route,'user.resetpwd')">
          <el-button icon="el-icon-switch" text :size="size" :type="type" @click.stop="resetAdminPwd(row)">重置密码</el-button>
        </template>
      </avue-crud>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="user">
import Tenant from '../../../components/tenant/index.vue'
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import {ref, watchEffect} from "vue";
import {add, block, del, list, resetPwd, unBlock, update} from "../../../api/admin"
import checkPerms from "../../../util/checkPerms"
import {useTenantStore} from "../../../store/tenant"
import {listV2} from "../../../api/role"
import _ from "lodash"
import {ElMessage} from "element-plus"

setTitle()

const tenantStore = useTenantStore()
const route = useRoute()
const admins = ref([])
const search = ref({
  account: '',
  phone: ''
})

const form = ref()

const loading = ref(false)
const tenantId = ref()
const tenantName = ref()
const showTenant = ref(tenantStore.tenantState.show)
const formType = ref('add')
const selectRows = ref<Array<any>>([])

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listAdmin = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({
    current: page.value.currentPage,
    page_size: page.value.pageSize,
    tenant_id: tenantId.value,
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
  tenantId.value = tenantStore.tenantState.tenant_id
  tenantName.value = tenantStore.tenantState.tenant_name
  showTenant.value = tenantStore.tenantState.show
})

const onTenantChange = async (param: any) => {
  tenantId.value = param.tenant_id
  await listAdmin()
}

const beforeOpen = async (done: any, type: any) => {
  formType.value = type
  if ('add' === type && !tenantId.value) {
    ElMessage.warning({message: '请先选择租户'})
    return
  }
  const res = await listV2()
  option.value.column.filter(v => {
    if (v.prop === 'tenant') {
      v.dicData = [{label: tenantName.value, value: tenantId.value}]
      v.value = tenantId.value
    }
    if (v.prop === 'role') {
      v.dicData = _.map(res.data, (item: any) => ({label: item.role_name, value: item.id}))
      if ('edit' === type) {
        v.value = form.value.role_id + ''
      } else {
        v.value = undefined
      }
    }
  })
  done && done()
}

const addAdmin = async (row: any, done: any, loading: any) => {
  const res = await add({
    tenant_id: row.tenant,
    account: row.account,
    username: row.username,
    phone: row.phone,
    role_id: row.role,
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
    id: row.id,
    tenant_id: row.tenant,
    username: row.username,
    phone: row.phone,
    role_id: row.role,
    password: row.password && row.password !== '' ? row.password : undefined
  })
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listAdmin()
  }, 800)
}

const delAdmin = async (row: any, index: any, done: any, loading: any) => {
  await del({id: row.id})
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    done()
    await listAdmin()
  }, 800)
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
  await resetPwd(row)
  ElMessage.success({message: '密码重置成功'})
}

const permission = ref({
  addBtn: checkPerms(route, 'user.add'),
  editBtn: checkPerms(route, 'user.edit'),
  delBtn: checkPerms(route, 'user.del'),
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
      value: tenantId.value,
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
      prop: 'tenant_name',
      slot: true,
      disabled: true,
      addDisplay: false,
      editDisplay: true,
    },
    {
      label: '用户名',
      prop: 'username',
      rules: [
        {required: true, message: '用户名不能为空', trigger: 'blur'}
      ]
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
    },
    {
      label: '角色',
      prop: 'role',
      type: 'select',
      dicData: [{}],
      value: undefined,
      slot: true
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
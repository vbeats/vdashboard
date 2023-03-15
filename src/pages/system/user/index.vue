<template>
  <el-row :gutter="12">
    <el-col v-show="showMerchant" :span="4">
      <el-card>
        <merchant @change-merchant="onMerchantChange"/>
      </el-card>
    </el-col>
    <el-col :span="showMerchant?20:24">
      <avue-crud ref="userRef" v-model="form" v-model:page="page" v-model:search="search" :before-open="beforeOpen" :data="admins"
                 :option="option" :permission="permission"
                 :table-loading="loading" @refresh-change="listAdmin"
                 @search-change="listAdmin" @size-change="listAdmin" @current-change="listAdmin"
                 @row-save="addAdmin" @row-update="updateAdmin" @row-del="delAdmin" @selection-change="selectList"
      >
        <template #merchantName="scope">
          <el-tag>{{ scope.row.merchantName }}</el-tag>
        </template>

        <template #roleName="scope">
          <el-tag type="danger">{{ scope.row.roleName }}</el-tag>
        </template>

        <template #status="scope">
          <el-tag :type="scope.row.status?'success':'danger'">{{ scope.row.status ? '正常' : '禁用' }}</el-tag>
        </template>

        <template #menu-left="{size}">
          <el-button v-if="checkPerms(route,'admin.user.block')" :size="size" icon="close" type="warning" @click.stop="blockAdmin">禁用</el-button>
          <el-button v-if="checkPerms(route,'admin.user.unblock')" :size="size" icon="el-icon-check" type="success" @click.stop="unBlockAdmin">解封</el-button>
        </template>

        <template #menu="{type,size,row}">
          <el-button v-if="checkPerms(route,'admin.user.resetpwd')" :size="size" :type="type" icon="el-icon-switch" text @click.stop="resetAdminPwd(row)">重置密码</el-button>
        </template>
      </avue-crud>
    </el-col>
  </el-row>
</template>

<script lang="ts" name="user" setup>
import Merchant from '../../../components/merchant/index.vue'
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import {ref, watchEffect} from "vue";
import {add, block, del, list, resetPwd, unBlock, update} from "../../../api/admin"
import {checkPerms} from "../../../util/permission"
import {useMerchantStore} from "../../../store/merchant"
import {ElMessage} from "element-plus"
import {listMerchantTree} from "../../../api/merchant";

setTitle()

const merchantStore = useMerchantStore()
const route = useRoute()
const admins = ref([])
const search = ref({
  account: '',
  phone: ''
})

const userRef = ref()
const form = ref({roleId: ''})

const loading = ref(true)
const merchantId = ref()
const merchantName = ref()
const showMerchant = ref(merchantStore.merchantState.show)
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
    pageSize: page.value.pageSize,
    merchantId: merchantId.value,
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
  merchantId.value = merchantStore.merchantState.merchantId
  merchantName.value = merchantStore.merchantState.merchantName
  showMerchant.value = merchantStore.merchantState.show
})

const onMerchantChange = async (param: any) => {
  merchantId.value = param.merchantId
  await listAdmin()
}

const beforeOpen = async (done: any, type: any) => {
  formType.value = type
  if ('add' === type && !merchantId.value) {
    ElMessage.warning({message: '请先选择商户'})
    return
  }
  const res = await listMerchantTree()
  option.value.column.filter(v => {
    if (v.prop === 'merchant') {
      v.dicData = [{label: merchantName.value, value: merchantId.value}]
      v.value = merchantName.value
    }
  })
  done && done()
}

const addAdmin = async (row: any, done: any, loading: any) => {
  const res = await add({
    ...row,
    merchantId: merchantId.value,
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

const permission = ref({
  addBtn: checkPerms(route, 'admin.user.add'),
  editBtn: checkPerms(route, 'admin.user.edit'),
  delBtn: checkPerms(route, 'admin.user.del'),
})
const option = ref({
  border: true,
  menuWidth: 350,
  selection: true,
  dialogWidth: '50%',
  column: [
    {
      label: '所属商户',
      prop: 'merchant',
      type: 'select',
      dicData: [{label: merchantName.value, value: merchantId.value}],
      value: merchantName.value,
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
      label: '所属商户',
      prop: 'merchantName',
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
      label: '角色',
      prop: 'roleName',
      slot: true,
      type: 'select',
      props: {
        label: 'roleName',
        value: 'id'
      },
      rules: [
        {required: true, message: '角色不能为空', trigger: 'blur'}
      ],
      dicUrl: '/admin/role/listAll',
      control: (v: any, f: any) => {
        form.value.roleId = v
      }
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
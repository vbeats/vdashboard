<template>
  <el-row>
    <el-col :span="4" v-show="showTenant">
      <el-card>
        <tenant @change-tenant="onTenantChange"/>
      </el-card>
    </el-col>
    <el-col :span="showTenant?19:24" :offset="showTenant?1:0">
      <avue-crud :data="openConfigs" v-model:search="search" :option="option" v-model:page="page" v-model="form"
                 :permission="permission" :table-loading="loading"
                 @refresh-change="listOpenConfig" @search-change="listOpenConfig"
                 @size-change="listOpenConfig" @current-change="listOpenConfig" :before-open="beforeOpen"
                 @row-save="addOpenConfig" @row-update="updateOpenConfig" @row-del="delOpenConfig"
      >
        <template #tenant_name="scope">
          <el-tag>{{ scope.row.tenant_name }}</el-tag>
        </template>

        <template #type="scope">
          <el-tag type="success">{{ scope.row.$type }}</el-tag>
        </template>

        <template #items-form="{}">
          <avue-crud :option="itemOption" :data="items" @row-save="addOpenItem" @row-del="delOpenItem" @row-update="updateOpenItem">
          </avue-crud>
        </template>
      </avue-crud>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import Tenant from '../../../components/tenant/index.vue'
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import {ref, watchEffect} from "vue"
import {add, del, list, update} from "../../../api/open"
import checkPerms from "../../../util/checkPerms"
import {useTenantStore} from "../../../store/tenant"
import {listV2} from "../../../api/role"
import {ElMessage} from "element-plus"

setTitle()

const tenantStore = useTenantStore()
const route = useRoute()
const openConfigs = ref([])
const search = ref({
  name: ''
})

const form = ref()
const items = ref<Array<any>>([])

const loading = ref(false)
const tenantId = ref()
const tenantName = ref()
const showTenant = ref(tenantStore.tenantState.show)
const formType = ref('add')

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listOpenConfig = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({
    current: page.value.currentPage,
    page_size: page.value.pageSize,
    tenant_id: tenantId.value,
    name: search.value.name
  })
  openConfigs.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listOpenConfig()

watchEffect(async () => {
  tenantId.value = tenantStore.tenantState.tenant_id
  tenantName.value = tenantStore.tenantState.tenant_name
  showTenant.value = tenantStore.tenantState.show
})

const onTenantChange = async (param: any) => {
  tenantId.value = param.tenant_id
  await listOpenConfig()
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
    if (v.prop === 'appid') {
      v.value = ''
    }
    if (v.prop === 'secret') {
      v.value = ''
    }
    if (v.prop === 'token') {
      v.value = ''
    }
    if (v.prop === 'aes_key') {
      v.value = ''
    }
    if (v.prop === 'cloud_env') {
      v.value = ''
    }
  })

  if ('edit' === type || 'view' === type) {
    const config = form.value.config ? JSON.parse(form.value.config) : null
    items.value = config && config.items ? config.items : []
    option.value.column.filter(v => {
      if (v.prop === 'appid') {
        v.value = config ? config.appid : ''
      }
      if (v.prop === 'secret') {
        v.value = config ? config.secret : ''
      }
      if (v.prop === 'token') {
        v.value = config ? config.token : ''
      }
      if (v.prop === 'aes_key') {
        v.value = config ? config.aesKey : ''
      }
      if (v.prop === 'cloud_env') {
        v.value = config ? config.cloudEnv : ''
      }
    })
  }

  done && done()
}

const getConfig = (row: any) => {
  let config = {}
  switch (row.type) {
    case 0:
    case 1:
    case 2:
      config = {appid: row.appid, secret: row.secret, token: row.token, aesKey: row.aes_key, cloudEnv: row.cloud_env}
      break
    case 3:
      config = {appid: row.appid, secret: row.secret, token: row.token, aesKey: row.aes_key, cloudEnv: row.cloud_env, items: items.value}
      break
    default:
      config = {}
  }
  return config
}
const addOpenConfig = async (row: any, done: any, loading: any) => {
  const res = await add({
    tenant_id: row.tenant,
    name: row.name,
    type: row.type,
    config: JSON.stringify(getConfig(row))
  })
  setTimeout(async () => {
    done()
    await listOpenConfig()
  }, 800)
}

const addOpenItem = async (row: any, done: any, loading: any) => {
  items.value.push({...row})
  done()
}

const updateOpenConfig = async (row: any, index: any, done: any, loading: any) => {
  await update({
    id: row.id,
    tenant_id: row.tenant,
    name: row.name,
    type: row.type,
    config: JSON.stringify(getConfig(row))
  })
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listOpenConfig()
  }, 800)
}

const updateOpenItem = async (row: any, index: any, done: any, loading: any) => {
  items.value[index] = {...row}
  done()
}

const delOpenConfig = async (row: any, index: any, done: any, loading: any) => {
  await del({id: row.id})
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    done()
    await listOpenConfig()
  }, 800)
}

const delOpenItem = async (row: any, index: any, done: any, loading: any) => {
  done()
}

const permission = ref({
  addBtn: checkPerms(route, 'open.add'),
  editBtn: checkPerms(route, 'open.edit'),
  delBtn: checkPerms(route, 'open.del'),
})
const option = ref({
  border: true,
  viewBtn: true,
  menuWidth: 380,
  dialogWidth: '60%',
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
      viewDisplay: false
    },
    {
      label: '名称',
      prop: 'name',
      editDisabled: true,
      search: true,
      rules: [
        {required: true, message: '名称不能为空', trigger: 'blur'}
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
      label: '类型',
      prop: 'type',
      type: 'radio',
      slot: true,
      dataType: 'array',
      dicData: [
        {
          label: '微信小程序',
          value: 0
        },
        {
          label: '微信公众平台',
          value: 1
        },
        {
          label: '企业微信',
          value: 2
        },
        {
          label: '微信开放平台',
          value: 3
        },
        {
          label: '支付宝小程序',
          value: 4
        }
      ],
      value: 0,
      width: 150,
      overHidden: true,
      rules: [
        {required: true, message: '类型不能为空', trigger: 'change'}
      ],
      control: (v: number, form: any) => {
        let appid = {
          display: false,
          value: ''
        }
        let secret = {
          display: false,
          value: ''
        }
        let token = {
          display: false,
          value: ''
        }
        let aes_key = {
          display: false,
          value: ''
        }
        let cloud_env = {
          display: false,
          value: ''
        }
        let items = {
          display: false,
          value: []
        }
        const config = form.config ? JSON.parse(form.config) : null
        switch (v) {
          case 0:
          case 1:
          case 2:
            appid.value = config ? config.appid : ''
            secret.value = config ? config.sceret : ''
            token.value = config ? config.token : ''
            aes_key.value = config ? config.aes_key : ''
            cloud_env.value = config ? config.cloud_env : ''
            appid.display = true
            secret.display = true
            token.display = true
            aes_key.display = true
            cloud_env.display = true
            break
          case 3:
            appid.value = config ? config.appid : ''
            secret.value = config ? config.sceret : ''
            token.value = config ? config.token : ''
            aes_key.value = config ? config.aes_key : ''
            cloud_env.value = config ? config.cloud_env : ''
            items.value = config ? config.items : []
            appid.display = true
            secret.display = true
            token.display = true
            aes_key.display = true
            cloud_env.display = true
            items.display = true
            break
          case 4:
            break
          default:
            // 啥也不干
        }

        return {
          appid, secret, token, aes_key, cloud_env, items
        }
      }
    },
    {
      label: 'appid',
      prop: 'appid',
      value: '',
      hide: true,
      display: false,
      rules: [
        {required: true, message: 'appid不能为空', trigger: 'blur'}
      ]
    },
    {
      label: 'secret',
      prop: 'secret',
      value: '',
      hide: true,
      display: false,
      rules: [
        {required: true, message: 'secret不能为空', trigger: 'blur'}
      ]
    },
    {
      label: 'token',
      prop: 'token',
      value: '',
      hide: true,
      display: false,
    },
    {
      label: 'aes_key',
      prop: 'aes_key',
      value: '',
      hide: true,
      display: false,
    },
    {
      label: 'cloud_env',
      prop: 'cloud_env',
      value: '',
      hide: true,
      display: false,
    },
    {
      labelWidth: 0,
      label: '',
      prop: 'items',
      span: 24,
      hide: true,
      formslot: true,
      display: false
    },
    {
      label: '配置信息',
      prop: 'config',
      addDisplay: false,
      editDisplay: false,
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

const itemOption = ref({
  refreshBtn: false,
  column: [
    {
      label: '类型',
      prop: 'type',
      type: 'radio',
      slot: true,
      dataType: 'array',
      dicData: [
        {
          label: '微信小程序',
          value: 0
        },
        {
          label: '微信公众平台',
          value: 1
        },
        {
          label: '企业微信',
          value: 2
        }
      ],
      value: 0,
      overHidden: true,
      rules: [
        {required: true, message: '类型不能为空', trigger: 'change'}
      ],
    },
    {
      label: '名称',
      prop: "name",
      rules: [
        {required: true, message: '名称不能为空', trigger: 'blur'}
      ],
    },
    {
      label: 'appid',
      prop: "appid",
      rules: [
        {required: true, message: 'appid不能为空', trigger: 'blur'}
      ],
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
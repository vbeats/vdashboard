<template>
  <el-dialog
      v-model="show"
      title="绑定应用"
      width="75%"
      @close="handleClose"
      destroy-on-close
      @open="listItems"
  >
    <avue-crud :data="items" v-model:search="search" :option="option" v-model:page="page" v-model="form"
               :permission="permission" :table-loading="loading"
               @refresh-change="listItems" @search-change="listItems"
               @size-change="listItems" @current-change="listItems" :before-open="beforeOpen"
               @row-save="addItem" @row-update="updateItem" @row-del="delItem"
    >
    </avue-crud>
  </el-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from "vue"
import checkPerms from "../../../util/checkPerms"
import {useRoute} from "vue-router"
import {addOpenItem, delOpenItem, listOpenItems, updateOpenItem} from "../../../api/open"
import {ElMessage} from "element-plus";

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  id: {
    type: String,
    required: false
  },
  openName: {
    type: String,
    required: false
  }
})

const route = useRoute()

const emit = defineEmits(['onClose'])

const open_config_name = computed(() => props.openName)

const items = ref([])
const search = ref({
  name: ''
})

const form = ref()

const loading = ref(false)

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const handleClose = async () => {
  emit('onClose')
}

const listItems = async (param?: any, done?: any) => {
  loading.value = true
  const res = await listOpenItems({
    current: page.value.currentPage,
    page_size: page.value.pageSize,
    open_config_id: props.id,
    name: search.value.name
  })
  items.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

const delItem = async (row: any, index: any, done: any, loading: any) => {
  await delOpenItem({id: row.id})
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    done()
    await listItems()
  }, 800)
}

const getConfig = (row: any) => {
  let config = {}
  switch (row.type) {
    case 0:
    case 1:
    case 2:
    case 3:
      config = {appid: row.appid, secret: row.secret, token: row.token, aesKey: row.aes_key, cloudEnv: row.cloud_env}
      break
    default:
      config = {}
  }
  return config
}

const addItem = async (row: any, done: any, loading: any) => {
  const res = await addOpenItem({
    name: row.name,
    type: row.type,
    open_config_id: props.id,
    config: JSON.stringify(getConfig(row))
  })
  setTimeout(async () => {
    done()
    await listItems()
  }, 800)
}


const updateItem = async (row: any, index: any, done: any, loading: any) => {
  await updateOpenItem({
    id: row.id,
    name: row.name,
    type: row.type,
    config: JSON.stringify(getConfig(row))
  })
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listItems()
  }, 800)
}

const beforeOpen = async (done: any, type: any) => {
  if ('edit' === type || 'view' === type) {
    const config = form.value.config ? form.value.config : null
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

const permission = ref({
  addBtn: checkPerms(route, 'open_item.add'),
  editBtn: checkPerms(route, 'open_item.edit'),
  delBtn: checkPerms(route, 'open_item.del'),
})
const option = ref({
  border: true,
  viewBtn: true,
  menuWidth: 380,
  dialogWidth: '60%',
  column: [
    {
      label: '所属平台',
      prop: 'open_config_name',
      value: open_config_name,
      hide: true,
      disabled: true,
      addDisplay: true,
      editDisplay: true,
      viewDisplay: true
    },
    {
      label: '名称',
      prop: 'name',
      search: true,
      rules: [
        {required: true, message: '名称不能为空', trigger: 'blur'}
      ]
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

        const config = form.config ? form.config : null

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

        return {
          appid, secret, token, aes_key, cloud_env
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
      display: false
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
      label: '配置信息',
      prop: 'config',
      addDisplay: false,
      editDisplay: false,
      overHidden: true,
      viewDisplay: false
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
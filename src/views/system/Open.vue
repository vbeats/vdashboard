<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'open:list')">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="appid">
          <a-input v-model:value="formState.appid" placeholder="appid" />
        </a-form-item>
      </a-col>
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="tenant_id">
          <a-select v-model:value="formState.tenant_id" placeholder="选择租户">
            <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col>
        <a-button type="primary" @click="openList">查询</a-button>
      </a-col>
      <a-col>
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'open:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增配置
  </a-button>
  <!--table-->
  <a-table
    :columns="columns"
    :data-source="datasource"
    :loading="loading"
    :pagination="{total, current, pageSize}"
    :row-key="(record) => record.id"
    bordered
    class="mt-8"
    @change="handleTableChange"
    v-if="checkPerms(actions, 'open:list')"
    :scroll="{x: 2048}"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'type'">
        <a-tag color="green" v-if="record.type === 0">微信公众号</a-tag>
        <a-tag color="purple" v-else-if="record.type === 1">微信小程序</a-tag>
        <a-tag color="#87d068" v-else-if="record.type === 2">其它</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button type="primary" @click="showModal('update', record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'open:update')"
            >更新
          </a-button>
          <a-button danger type="primary" @click="handleDeleteOpen(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'open:delete')">
            删除
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <OpenModal :visible="visible" :mode="mode" :item="item" :tenants="tenants" @handleOk="handleAddOrUpdateOpen" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import {listAll as listAllTenants} from '@/api/system/tenant'
import {useStore} from 'vuex'
import {add, del, list, update} from '@/api/system/open'
import OpenModal from '@/components/modal/system/OpenModal.vue'
import {message} from 'ant-design-vue'

interface FormState {
  appid?: string
  tenant_id: string
}

const columns = [
  {
    title: '所属租户',
    dataIndex: 'tenant_name',
  },
  {
    title: 'Appid',
    dataIndex: 'appid',
  },
  {
    title: 'Secret',
    dataIndex: 'secret',
  },
  {
    title: '类型',
    align: 'center',
    key: 'type',
  },
  {
    title: '备注信息',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
  },
  {
    title: '操作',
    align: 'center',
    key: 'operation',
    fixed: 'right',
  },
]

const actions: Array<string> = useRoute().meta.actions as Array<string>
const user = useStore().getters.getUserInfo

const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({tenant_id: user.tenant_id})
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const mode = ref('add')
const visible = ref(false)
const item = ref()
const tenants = ref([])
const ids = ref<Array<string>>([])

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  openList()
}

const openList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    appid: formState.appid,
    tenant_id: formState.tenant_id,
  }).then((res) => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

const tenantList = async () => {
  const res = await listAllTenants()
  tenants.value = res.data
  formState.tenant_id = user.tenant_id
}

tenantList()

checkPerms(actions, 'open:list') && openList()

const showModal = (t: string, record: any = {}) => {
  mode.value = t
  item.value = record
  visible.value = true
}

// 删除配置
const handleDeleteOpen = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => openList(), 800)
  }
}

const reset = () => {
  formRef.value.resetFields()
}

// 新增 更新 open config
const handleAddOrUpdateOpen = async (param: any) => {
  if (param.id && param.id !== '') {
    const res = await update(param)
    handleResult(res)
  } else {
    const res = await add(param)
    handleResult(res)
  }
}

const handleResult = (res: any) => {
  if (res.code === 200) {
    message.success('success')
    handleModalCancel()
    openList()
  }
}

const handleModalCancel = () => {
  mode.value = 'add'
  item.value = {}
  visible.value = false
}
</script>

<style scoped lang="stylus"></style>

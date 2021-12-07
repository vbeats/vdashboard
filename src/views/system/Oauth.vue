<template>
  <a-form ref="formRef" :model="formState" v-if="checkPerms(actions, 'oauth:list')">
    <a-row :gutter="[16, 4]">
      <a-col :xs="{span: 24}" :md="{span: 6}" :xl="{span: 4}">
        <a-form-item name="client_id">
          <a-input v-model:value="formState.client_id" placeholder="client id" />
        </a-form-item>
      </a-col>
      <a-col>
        <a-button type="primary" @click="oauthList">查询</a-button>
      </a-col>
      <a-col>
        <a-button @click="reset">重置</a-button>
      </a-col>
    </a-row>
  </a-form>
  <!--添加-->
  <a-button class="mt-4" type="primary" @click="showModal('add')" v-if="checkPerms(actions, 'oauth:add')">
    <template #icon>
      <PlusCircleOutlined />
    </template>
    新增Oauth2 Client
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
    v-if="checkPerms(actions, 'oauth:list')"
    :scroll="{x: 2048}"
  >
    <template #bodyCell="{column, record}">
      <template v-if="column.key === 'grant_type'">
        <a-space direction="vertical">
          <a-tag color="blue" v-for="(item, index) in record.grant_type.split(',')" :key="index">{{ item }}</a-tag>
        </a-space>
      </template>
      <template v-if="column.key === 'platform'">
        <a-tag color="green" v-if="record.platform === 0">WEB</a-tag>
        <a-tag color="purple" v-else-if="record.platform === 1">APP</a-tag>
        <a-tag color="#87d068" v-else-if="record.platform === 2">小程序</a-tag>
      </template>
      <template v-else-if="column.key === 'operation'">
        <a-space>
          <a-button type="primary" @click="showModal('update', record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'oauth:update')"
            >更新
          </a-button>
          <a-button danger type="primary" @click="handleDeleteClient(record)" :disabled="record.delete_time && record.delete_time !== ''" v-if="checkPerms(actions, 'oauth:delete')"
            >删除
          </a-button>
        </a-space>
      </template>
    </template>
  </a-table>
  <!--  modal -->
  <OauthModal :visible="visible" :mode="mode" :item="item" @handleOk="handleAddOrUpdateClient" @handleCancel="handleModalCancel" />
</template>

<script lang="ts" setup>
import {PlusCircleOutlined} from '@ant-design/icons-vue'
import {reactive, ref, UnwrapRef} from 'vue'
import {message} from 'ant-design-vue'
import {add, del, list, update} from '@/api/system/oauth'
import {useRoute} from 'vue-router'
import {checkPerms} from '@/util/authUtil'
import {useStore} from 'vuex'
import OauthModal from '@/components/modal/system/OauthModal.vue'
import {listAll} from '@/api/system/tenant'

interface FormState {
  client_id?: string
}

const columns = [
  {
    title: 'Client Id',
    dataIndex: 'client_id',
  },
  {
    title: 'Secret',
    dataIndex: 'secret',
    ellipsis: true,
  },
  {
    title: '认证类型',
    key: 'grant_type',
  },
  {
    title: 'Scope',
    dataIndex: 'scope',
  },

  {
    title: '平台',
    key: 'platform',
  },
  {
    title: 'access_token有效时间',
    dataIndex: 'access_token_expire',
    width: 180,
  },
  {
    title: 'refresh_token有效时间',
    dataIndex: 'refresh_token_expire',
    width: 180,
  },
  {
    title: 'Redirect',
    dataIndex: 'redirect_url',
    ellipsis: true,
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 200,
  },
  {
    title: '删除时间',
    dataIndex: 'delete_time',
    width: 200,
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
const formState: UnwrapRef<FormState> = reactive({})
const datasource = ref([])
const loading = ref(false)
const total = ref(0)
const current = ref(1)
const pageSize = ref(10)
const mode = ref('add')
const visible = ref(false)
const menuVisible = ref(false)
const userVisible = ref(false)
const item = ref()

const handleTableChange = (page: {current: number; pageSize: number}) => {
  current.value = page.current
  pageSize.value = page.pageSize
  oauthList()
}

const oauthList = () => {
  loading.value = true
  list({
    current: current.value,
    page_size: pageSize.value,
    client_id: formState.client_id,
  }).then((res) => {
    loading.value = false
    datasource.value = res.data.rows
    total.value = res.data.total
  })
}

checkPerms(actions, 'oauth:list') && oauthList()

// 删除oauth client
const handleDeleteClient = async (record: any) => {
  const res = await del(record.id)
  if (res.code === 200) {
    message.success('删除成功')
    setTimeout(() => oauthList(), 800)
  }
}

const showModal = (t: string, record: any = {}) => {
  mode.value = t
  item.value = record
  visible.value = true
}

const handleModalCancel = () => {
  item.value = {}
  visible.value = false
  menuVisible.value = false
  userVisible.value = false
}

const handleAddOrUpdateClient = async (param: any) => {
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
    oauthList()
  }
}

const reset = () => {
  formRef.value.resetFields()
}
</script>

<style scoped lang="stylus"></style>

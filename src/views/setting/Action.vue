<template>
  <a-form
      ref="formRef"
      layout="inline"
      :model="formState" class="flex flex-wrap"
  >
    <a-form-item name="username" :wrapperCol="{span:24}"
                 class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4">
      <a-input v-model:value="formState.name" placeholder="接口地址">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
        </template>
      </a-input>
    </a-form-item>
    <!--查询-->
    <a-form-item class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4" v-if="actions.list">
      <a-button
          type="primary"
          html-type="submit"
          @click="queryUser"
          @keyup.enter="queryUser"
      >
        查询
      </a-button>
      <a-button @click="resetFields" class="ml-4">
        重置
      </a-button>
    </a-form-item>
  </a-form>
  <!--添加-->
  <a-button type="primary" class="mt-4" v-if="actions.add"
            @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增接口
  </a-button>
  <!--table-->
  <a-table bordered
           :columns="columns"
           :row-key="record => record.id"
           :data-source="datasource"
           :pagination="{total,current,pageSize}"
           :loading="loading"
           @change="handleTableChange" :scroll="{x:1000}" class="mt-8"
  >
    <template #operation="{ record }" v-if="actions.update||actions.delete">
      <a-space>
        <a-button type="primary" v-if="actions.update" @click="showUpdateModal(record)">更新
        </a-button>
        <a-button type="danger" v-if="actions.delete" @click="handleDeleteAction(record)">删除
        </a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <actions-modal :visible="actionModal" :action="modalType" :data="item" @cancel="handleCancel"
                 @handle_action="handleAction"/>

</template>

<script lang="ts">
import {computed, defineComponent, reactive, Ref, ref, toRefs, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {EditOutlined, PlusCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import {addAction, delAction, getActionsList, updateAction} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {message} from "ant-design-vue";
import TenantModal from "@/components/modal/TenantModal.vue";
import ActionsModal from "@/components/modal/ActionsModal.vue";

type Pagination = TableState['pagination']

interface FormState {
  api: string
}

interface DataItem {
  id: number;
  api: string;
  action: string;
}

export default defineComponent({
  name: "Action",
  components: {ActionsModal, TenantModal, UserModal, PlusCircleOutlined, EditOutlined, UserOutlined},
  setup() {
    const formRef = ref()
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const actions: Actions = checkPerms('action', perms)

    const formState: UnwrapRef<FormState> = reactive({
      api: ''
    });

    const data = reactive({
      loading: true,
      total: 0,
      current: 1,
      pageSize: 10,
      actionModal: false,
      modalType: 'add', // add|update
      item: {}
    })

    const datasource: Ref<DataItem[]> = ref([])

    const api = computed(() => formState.api)

    const resetFields = () => {
      formRef.value && formRef.value.resetFields()
    }

    const queryUser = () => {
      formRef.value.validate().then(() => {
        actionList()
      })

    }
    const actionList = () => {
      getActionsList({current: data.current, page_size: data.pageSize}, api.value).then(res => {
        data.loading = false
        datasource.value = res.data.rows
        data.total = res.data.total
      })
    }

    // 获取租户列表
    actions.list && actionList()

    const columns = [
      {
        title: 'API接口',
        dataIndex: 'api',
      },
      {
        title: '权限',
        dataIndex: 'action',
      },
      {
        title: '操作',
        width: '300px',
        align: 'center',
        slots: {customRender: 'operation'},
      }
    ];

    const handleTableChange = (page: Pagination) => {
      data.current = page?.current || 1
      data.pageSize = page?.pageSize || 10
      actionList()
    }

    const showUpdateModal = async (record: any) => {
      data.item = record
      data.modalType = 'update'
      data.actionModal = true
    }

    // 新增or update action
    const handleAction = (item: any) => {

      if (item.id && item.id > 0) {
        // update
        updateAction(item).then((res) => {
          message.success('更新成功')
          handleRes(res)
        })
      } else {
        // add
        addAction(item).then((res) => {
          message.success('添加成功')
          handleRes(res)
        })
      }
    }

    const handleRes = (res: any) => {
      if (res.code !== 200) return

      setTimeout(() => {
        handleCancel()
        actionList()
      }, 1200)
    }

    const handleCancel = () => {
      data.item = {}
      data.actionModal = false
      data.modalType = 'add'
      resetFields()
    }

    const showAddModal = () => {
      data.actionModal = true
    }

    const handleDeleteAction = async (recode: any) => {
      const res = await delAction({id: recode.id})
      if (res.code === 200) {
        message.success('删除成功')
        setTimeout(() => actionList(), 380)
      }
    }

    return {
      formRef,
      formState,
      datasource,
      perms,
      queryUser,
      resetFields,
      actions,
      ...toRefs(data),
      columns,
      handleCancel,
      handleTableChange,
      showUpdateModal,
      handleAction,
      showAddModal, handleDeleteAction
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
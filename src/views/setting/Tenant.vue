<template>
  <a-form
      ref="formRef"
      layout="inline"
      :model="formState" class="flex flex-wrap"
  >
    <a-form-item name="username" :wrapperCol="{span:24}"
                 class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4">
      <a-input v-model:value="formState.name" placeholder="租户名">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
        </template>
      </a-input>
    </a-form-item>
    <!--查询-->
    <a-form-item class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4" v-if="tenantActions.list">
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
  <a-button type="primary" class="mt-4" v-if="tenantActions.add"
            @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增租户
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
    <template #operation="{ record }" v-if="tenantActions.update||tenantActions.delete">
      <a-space>
        <a-button type="primary" v-if="tenantActions.update" @click="showUpdateModal(record)">更新
        </a-button>
        <a-button type="danger" v-if="tenantActions.delete" @click="handleDeleteTenant(record)">删除
        </a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <tenant-modal :visible="tenantModal" :action="modalType" :data="item" @cancel="handleCancel"
                @handleTenant="handleTenant"/>

</template>

<script lang="ts">
import {computed, defineComponent, reactive, Ref, ref, toRefs, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {EditOutlined, PlusCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import {addTenant, delTenant, getTenantList, updateTenant} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {message} from "ant-design-vue";
import TenantModal from "@/components/modal/TenantModal.vue";

type Pagination = TableState['pagination']

interface FormState {
  name: string
}

interface DataItem {
  id: number;
  code: string;
  name: string;
  create_time: string
}

export default defineComponent({
  name: "Tenant",
  components: {TenantModal, UserModal, PlusCircleOutlined, EditOutlined, UserOutlined},
  setup() {
    const formRef = ref()
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const tenantActions: Actions = checkPerms('tenant', perms)

    const formState: UnwrapRef<FormState> = reactive({
      name: ''
    });

    const data = reactive({
      loading: true,
      total: 0,
      current: 1,
      pageSize: 10,
      tenantModal: false,
      modalType: 'add', // add|update
      item: {}
    })

    const datasource: Ref<DataItem[]> = ref([])

    const name = computed(() => formState.name)

    const resetFields = () => {
      formRef.value && formRef.value.resetFields()
    }

    const queryUser = () => {
      formRef.value.validate().then(() => {
        tenantList()
      })

    }
    const tenantList = () => {
      getTenantList({current: data.current, page_size: data.pageSize}, name.value).then(res => {
        data.loading = false
        datasource.value = res.data.rows
        data.total = res.data.total
      })
    }

    // 获取租户列表
    tenantActions.list && tenantList()

    const columns = [
      {
        title: '租户编号',
        dataIndex: 'code',
      },
      {
        title: '租户名称',
        dataIndex: 'name',
      },
      {
        title: '加入时间',
        dataIndex: 'create_time',
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
      tenantList()
    }

    const showUpdateModal = async (record: any) => {
      data.item = record
      data.modalType = 'update'
      data.tenantModal = true
    }

    // 新增or update租户
    const handleTenant = (item: any) => {

      if (item.id && item.id > 0) {
        // update
        updateTenant(item).then((res) => {
          message.success('更新成功')
          handleRes(res)
        })
      } else {
        // add
        addTenant(item).then((res) => {
          message.success('添加成功')
          handleRes(res)
        })
      }
    }

    const handleRes = (res: any) => {
      if (res.code !== 200) return

      setTimeout(() => {
        handleCancel()
        tenantList()
      }, 1200)
    }

    const handleCancel = () => {
      data.item = {}
      data.tenantModal = false
      data.modalType = 'add'
      resetFields()
    }

    const showAddModal = () => {
      data.tenantModal = true
    }

    const handleDeleteTenant = async (record: any) => {
      const res = await delTenant({id: record.id})
      if (res.code === 200) {
        message.success('删除成功')
        setTimeout(() => tenantList(), 380)
      }
    }

    return {
      formRef,
      formState,
      datasource,
      perms,
      queryUser,
      resetFields,
      tenantActions,
      ...toRefs(data),
      columns,
      handleCancel,
      handleTableChange,
      showUpdateModal,
      handleTenant,
      showAddModal,
      handleDeleteTenant
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
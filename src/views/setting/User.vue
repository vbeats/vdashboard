<template>
  <a-form
      ref="formRef"
      layout="inline"
      :model="formState" class="flex flex-wrap"
  >
    <a-form-item name="username" :wrapperCol="{span:24}"
                 class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4">
      <a-input v-model:value="formState.username" placeholder="用户名">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
        </template>
      </a-input>
    </a-form-item>
    <!--查询-->
    <a-form-item class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4" v-if="userActions.list">
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
  <a-button type="primary" class="mt-4" v-if="userActions.add&&roleActions.list" @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增用户
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
    <template #status="{record}">
      <a-tag color="#87d068" v-if="record.status==='正常'">正常</a-tag>
      <a-tag color="pink" v-else>禁用</a-tag>
    </template>
    <template #operation="{ record }" v-if="roleActions.update||userActions.update">
      <a-space>
        <a-button type="primary" v-if="userActions.list&&userActions.update" @click="showUpdateModal(record)">更新
        </a-button>
        <a-button type="danger" v-if="userActions.list&&userActions.update" @click="handleUpdateUserStatus(record)">{{
            record.status === '正常' ? "禁用" : "启用"
          }}
        </a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <UserModal :visible="userModal" @handleUser="handleUser"
             @cancel="handleCancel" :roles="roles"
             :action="modalType" :data="userFormState"/>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, Ref, ref, toRefs, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {EditOutlined, PlusCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import {addUser, getRoleList, getUserList, updateUser, updateUserStatus} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {UserFormState} from "@/interface/setting/user";
import {message} from "ant-design-vue";
import user from "@/store/modules/user";
import encrypt from "@/utils/crypto";

type Pagination = TableState['pagination']

interface FormState {
  username: string
}

interface DataItem {
  id: number;
  username: string;
  role_name?: number;
  phone?: string;
  create_time: string
}

export default defineComponent({
  name: "User",
  components: {UserModal, PlusCircleOutlined, EditOutlined, UserOutlined},
  setup() {
    const formRef = ref()
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const userActions: Actions = checkPerms('user', perms)
    const roleActions: Actions = checkPerms('role', perms)

    const formState: UnwrapRef<FormState> = reactive({
      username: ''
    });

    const userFormState = ref<UserFormState>()

    const data = reactive({
      loading: true,
      total: 0,
      current: 1,
      pageSize: 10,
      userModal: false,
      modalType: 'add', // add|update
    })

    const datasource: Ref<DataItem[]> = ref([])

    const roleValue: Ref<string> = ref('')

    const roles: Ref<object> = ref()

    const username = computed(() => formState.username)

    const resetFields = () => {
      formRef.value && formRef.value.resetFields()
    }

    const queryUser = () => {
      formRef.value.validate().then(() => {
        userList()
      })

    }
    const userList = () => {
      getUserList({current: data.current, page_size: data.pageSize}, username.value).then(res => {
        data.loading = false
        datasource.value = res.data.rows
        data.total = res.data.total
      })
    }

    // 获取用户列表
    userActions.list && userList()

    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
      },
      {
        title: '租户',
        dataIndex: 'tenant_name'
      },
      {
        title: '角色',
        dataIndex: 'role_name',
      },
      {
        title: '状态',
        align: 'center',
        slots: {customRender: 'status'},
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
      userList()
    }

    const showUpdateModal = async (record: any) => {
      const rs = await getRoleList({current: 1, page_size: 10000})
      roles.value = rs.data.rows || []
      userFormState.value = {...record}
      data.modalType = 'update'
      data.userModal = true
    }

    // 新增or update用户
    const handleUser = (item: UserFormState) => {
      if (item.password && item.password.length > 0) {
        item.password = encrypt(item.password)
      }

      if (item.id && item.id > 0) {
        // update
        updateUser(item).then((res) => {
          message.success('更新成功')
          handleRes(res)
        })
      } else {
        // add
        addUser(item).then((res) => {
          message.success('添加成功')
          handleRes(res)
        })
      }
    }

    const handleRes = (res: any) => {
      if (res.code !== 200) return

      setTimeout(() => {
        handleCancel()
        userList()
      }, 1200)
    }

    const handleCancel = () => {
      roles.value = []
      data.userModal = false
      data.modalType = 'add'
      userFormState.value = {}
      resetFields()
    }

    const handleUpdateUserStatus = (record: any) => {
      updateUserStatus(record.id).then(() => {
        message.success('状态更新成功')
        setTimeout(() => {
          userList()
        }, 800)
      })
    }

    const showAddModal = async () => {
      const rs = await getRoleList({current: 1, page_size: 10000})
      roles.value = rs.data.rows || []
      data.userModal = true
    }

    return {
      formRef,
      formState,
      datasource,
      perms,
      queryUser,
      resetFields,
      userActions,
      roleActions,
      ...toRefs(data), roles,
      columns,
      handleCancel,
      handleTableChange,
      userFormState,
      showUpdateModal,
      handleUser,
      handleUpdateUserStatus,
      roleValue,
      showAddModal
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
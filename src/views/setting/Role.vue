<template>
  <a-form
      ref="formRef"
      layout="inline"
      :model="formState" class="flex flex-wrap"
  >
    <a-form-item name="role_name" :wrapperCol="{span:24}"
                 class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4">
      <a-input v-model:value="formState.role_name" placeholder="角色名">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)"/>
        </template>
      </a-input>
    </a-form-item>
    <!--查询-->
    <a-form-item class="sm:w-3/4 md:w-3/4 lg:w-1/2 xl:w-1/4 2xl:w-1/4" v-if="roleActions.list">
      <a-button
          type="primary"
          html-type="submit"
          @click="queryRole"
          @keyup.enter="queryRole"
      >
        查询
      </a-button>
      <a-button @click="resetFields" class="ml-4">
        重置
      </a-button>
    </a-form-item>
  </a-form>
  <!--添加-->
  <a-button type="primary" class="mt-4" v-if="roleActions.add" @click="roleModal=true">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增角色
  </a-button>
  <!--table-->
  <a-table bordered
           :columns="columns"
           :row-key="record => record.id"
           :data-source="rows"
           :pagination="{total,current,pageSize}"
           :loading="loading"
           @change="handleTableChange" :scroll="{x:800}" class="mt-8"
  >
    <template #role="{text,record}">
      <div class="relative">
        <a-input
            v-if="showEditCell&&currentEditRecord.id===record.id&&roleActions.list&&roleActions.update"
            autofocus
            v-model:value="roleValue" class="w-full"
            @blur="cancelRoleEdit" @pressEnter="handleUpdateRole"
        />
        <div v-else>
          {{ text || '' }}
          <EditOutlined @click="editRoleCell(record)" class="ml-2"/>
        </div>
      </div>
    </template>
    <template #operation="{ record }" v-if="roleActions.update||userActions.update">
      <a-space>
        <a-button type="primary" v-if="actionActions.list&&actionActions.update" @click="showActionModal(record)">权限
        </a-button>
        <a-button v-if="userActions.list&&userActions.update" @click="bindUsers(record)">用户</a-button>
        <a-button type="danger" v-if="roleActions.delete" @click="handleDelRole(record.id)">删除</a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <ActionModal :visible="actionModal" @handleCancel="handleActionModalCancel"
               @handleOk="handleUpdateRoleAction"
               :datasource="actions"/>

  <RoleModal :visible="roleModal" @handleRole="handleRole"
             @cancel="handleCancel" :data="formState"/>

  <UserTableModal :visible="userTableModal" :datasource="userDatasource" :total="user_total" :current="user_current"
                  :page-size="user_pageSize" @handleCancel="handleUserTableCancel" :selected-keys="selectedKeys"
                  @handleOk="handleUpdateUserRole"
                  @handleTableChange="handleUserTableModalChange" :current-role-name="currentEditRecord.name"/>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {EditOutlined, PlusCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import {
  addRole,
  delRole,
  getActionList,
  getRoleList,
  getRoleUserList,
  updateRole,
  updateRoleActions,
  updateUserRoles
} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {message} from "ant-design-vue";
import user from "@/store/modules/user";
import {RoleFormState} from "@/interface/setting/user";
import RoleModal from "@/components/modal/RoleModal.vue";
import UserTableModal from "@/components/modal/UserTableModal.vue";
import ActionModal from "@/components/modal/ActionModal.vue";
import _ from "lodash";

type Pagination = TableState['pagination']

export default defineComponent({
  name: "Role",
  components: {UserTableModal, RoleModal, UserModal, ActionModal, PlusCircleOutlined, EditOutlined, UserOutlined},
  setup() {
    const formRef = ref()
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const userActions: Actions = checkPerms('user', perms)
    const roleActions: Actions = checkPerms('role', perms)
    const actionActions: Actions = checkPerms('action', perms)

    const formState: UnwrapRef<RoleFormState> = reactive({
      role_name: ''
    });

    const data = reactive({
      rows: [],
      loading: true,
      total: 0,
      current: 1,
      pageSize: 10,
      roleModal: false,
      userTableModal: false,
      roleValue: '',
      showEditCell: false,
      currentEditRecord: {id: 0, name: ''},
      user_total: 0,
      user_current: 1,
      user_pageSize: 10,
      user_loading: false,
      actionModal: false,
      actions: []
    })

    const roleName = computed(() => formState.role_name)

    const resetFields = () => {
      formRef.value && formRef.value.resetFields()
    }

    const queryRole = () => {
      formRef.value.validate().then(() => {
        roleList()
      })

    }
    const roleList = () => {
      getRoleList({current: data.current, page_size: data.pageSize}, roleName.value).then(res => {
        data.loading = false
        data.rows = res.data.rows
        data.total = res.data.total
      })
    }

    // 获取角色列表
    roleActions.list && roleList()

    const columns = [
      {
        title: '角色名',
        dataIndex: 'role_name',
        slots: {customRender: 'role'}
      },
      {
        title: '操作',
        width: '500px',
        align: 'center',
        slots: {customRender: 'operation'},
      }
    ];

    const handleTableChange = (page: Pagination) => {
      data.current = page?.current || 1
      data.pageSize = page?.pageSize || 10
      roleList()
    }

    // 新增or update角色
    const handleRole = (item: RoleFormState) => {
      if (item.id && item.id > 0) {
        // update
        updateRole(item).then((res: any) => {
          message.success('更新成功')
          handleRes(res)
        })
      } else {
        // add
        addRole(item).then((res: any) => {
          message.success('添加成功')
          handleRes(res)
        })
      }
    }

    const handleRes = (res: any) => {
      if (res.code !== 200) return

      setTimeout(() => {
        handleCancel()
        roleList()
        cancelRoleEdit()
      }, 800)
    }

    const handleCancel = () => {
      data.roleModal = false
      resetFields()
    }

    const handleDelRole = (id: number) => {
      delRole(id).then((res: any) => {
        if (res.code === 200) {
          message.success('删除成功')
          roleList()
        }
      })
    }

    // 角色编辑
    const editRoleCell = (record: any) => {
      data.currentEditRecord = record
      data.showEditCell = true
      data.roleValue = record.role_name
    }
    const cancelRoleEdit = () => {
      data.currentEditRecord = {id: 0, name: ""}
      data.roleValue = ''
      data.showEditCell = false
    }
    const handleUpdateRole = () => {
      if (data.roleValue && data.roleValue.length > 0) {
        handleRole({id: data.currentEditRecord.id, role_name: data.roleValue})
      }
    }

    // 分配用户
    const userDatasource = ref([])
    const selectedKeys = ref<number[]>([])
    const initKeys = ref<number[]>([])

    const bindUsers = (record: any) => {
      data.currentEditRecord = {id: record.id, name: record.role_name}
      userList(true).then(() => data.userTableModal = true)
    }

    const handleUserTableCancel = () => {
      data.userTableModal = false
      data.user_total = 0
      data.user_current = 1
      data.user_pageSize = 10
      userDatasource.value = []
      selectedKeys.value = []
    }

    const handleUserTableModalChange = (page: Pagination, roleName: string) => {
      data.user_current = page?.current || 1
      data.user_pageSize = page?.pageSize || 10
      userList(false)
    }

    // 获取用户, 防止table页码切换时重复更新子组件初始selectedKeys
    const userList = async (initList: boolean) => {
      data.user_loading = true
      await getRoleUserList({
        current: data.user_current,
        page_size: data.user_pageSize
      }, data.currentEditRecord.name).then(res => {
        if (res.code === 200) {
          data.user_loading = false
          data.user_total = res.data.total
          userDatasource.value = res.data.rows
          if (initList) {
            initKeys.value = _.cloneDeep(res.data.keys) || [];
            selectedKeys.value = res.data.keys || []
          }
        }
      })
    }

    const handleUpdateUserRole = (params: any) => {
      const {keys, unKeys} = params
      updateUserRoles(keys, _.intersection(initKeys.value, unKeys), data.currentEditRecord.id).then(() => {
        message.success('更新成功')
        setTimeout(handleUserTableCancel, 800)
      })
    }

    // 用户action权限
    const showActionModal = (record: any) => {
      data.currentEditRecord = record
      getActionList(record.id).then((res) => {
        data.actions = res.data
        data.actionModal = true
      })
    };

    const handleActionModalCancel = () => {
      data.actionModal = false
      data.currentEditRecord = {id: 0, name: ''}
    }

    const handleUpdateRoleAction = (items: any) => {
      if (items.length === 0) {
        handleActionModalCancel()
        return
      }
      updateRoleActions(items, data.currentEditRecord.id, data.currentEditRecord.name).then(() => {
        message.success('保存成功')
        setTimeout(handleActionModalCancel, 800)
      })
    }

    return {
      formRef,
      formState,
      perms,
      queryRole,
      resetFields,
      userActions,
      roleActions,
      actionActions,
      ...toRefs(data),
      columns,
      handleCancel,
      bindUsers,
      userDatasource,
      handleUserTableCancel,
      handleTableChange,
      handleRole,
      handleDelRole,
      editRoleCell,
      cancelRoleEdit,
      handleUpdateRole, handleActionModalCancel, handleUpdateRoleAction,
      handleUserTableModalChange, selectedKeys, handleUpdateUserRole, showActionModal
    }
  }
})
</script>

<style scoped>

</style>
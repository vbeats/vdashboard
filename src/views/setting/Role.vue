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
           @change="handleTableChange" :scroll="{x:1000}" class="mt-8"
  >
    <template #operation="{ record }" v-if="roleActions.update||userActions.update">
      <a-space>
        <a-button type="primary" v-if="userActions.list&&userActions.update">用户</a-button>
        <a-button type="warn" v-if="roleActions.update" @click="showUpdateModal(record)">更新</a-button>
        <a-button type="danger" v-if="roleActions.delete" @click="handleDelRole(record.id)">删除</a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <RoleModal :visible="roleModal" @handleRole="handleRole"
             @cancel="handleCancel"
             :action="modalType" :data="formState"/>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs, UnwrapRef} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {PlusCircleOutlined} from '@ant-design/icons-vue';
import {addRole, delRole, getRoleList, updateRole} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {message} from "ant-design-vue";
import user from "@/store/modules/user";
import {RoleFormState} from "@/interface/setting/user";
import RoleModal from "@/components/modal/RoleModal.vue";

type Pagination = TableState['pagination']

export default defineComponent({
  name: "User",
  components: {RoleModal, UserModal, PlusCircleOutlined},
  setup() {
    const formRef = ref()
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const userActions: Actions = checkPerms('user', perms)
    const roleActions: Actions = checkPerms('role', perms)

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
      modalType: 'add', // add|update
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
    roleList()

    const columns = [
      {
        title: '角色名',
        dataIndex: 'role_name',
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
      roleList()
    }

    const showUpdateModal = (record: any) => {
      formState.id = record.id
      formState.role_name = record.role_name
      data.modalType = 'update'
      data.roleModal = true
    };

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
      }, 1200)
    }

    const handleCancel = () => {
      data.roleModal = false
      data.modalType = 'add'
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

    return {
      formRef,
      formState,
      perms, queryRole, resetFields, userActions, roleActions,
      ...toRefs(data), columns, handleCancel,
      handleTableChange, showUpdateModal, handleRole, handleDelRole
    }
  }
})
</script>

<style scoped>

</style>
<template>
  <el-dialog
      v-model="props.visible"
      :close-on-click-modal="false"
      destroy-on-close
      title="角色配置"
      width="50%"
      @opened="afterModalOpen"
      @close="closeRoleModal"
  >
    <avue-crud ref="roleRef" v-model:page="page" :data="roles" :option="option" :table-loading="loading"
               @refresh-change="listRole" @search-change="listRole" @selection-change="selectList"
               @size-change="listRole" @current-change="listRole"

    />

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeRoleModal">取消</el-button>
        <el-button type="primary" @click="assignRole">确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {list, listAdminRoles} from "../../../api/role"
import _ from "lodash";
import {assignAdminRoles} from "../../../api/admin";
import {ElMessage} from "element-plus";

const emit = defineEmits(['closeRoleModal'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
    default: false
  },
  userId: {
    type: String,
    required: true
  }
})

const roleRef = ref()
const loading = ref(true)
const roles = ref([])
const selectRows = ref([])

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 15
})

const listRole = async (param?: any, done?: any) => {
  loading.value = true
  const res = await list({current: page.value.currentPage, pageSize: page.value.pageSize})
  roles.value = res.data.rows || []
  page.value.total = res.data.total || 0
  done && done()
}

const afterModalOpen = async () => {
  await listRole()
  const res = await listAdminRoles({adminId: props.userId})
  if (res.data && res.data.length > 0) {
    res.data.forEach((item: any) => {
      const index = _.findIndex(roles.value, (value: any) => value.id === item.id)
      if (index >= 0) {
        roleRef.value.toggleSelection([roles.value[index]])
      }
    })
  }
  loading.value = false
}

const closeRoleModal = () => {
  emit('closeRoleModal')
}

const selectList = (rows: any) => {
  selectRows.value = rows
}

const assignRole = async () => {
  await assignAdminRoles({adminId: props.userId, roles: selectRows.value})
  ElMessage.success({message: '更新成功'})
  emit('closeRoleModal')
}

const option = ref({
  border: true,
  addBtn: false,
  editBtn: false,
  delBtn: false,
  refreshBtn: false,
  columnBtn: false,
  menu: false,
  selection: true,
  column: [
    {
      label: '角色名称',
      prop: 'roleName'
    },
    {
      label: '权限字段',
      prop: 'action'
    },
    {
      label: '备注',
      prop: 'remark',
    }
  ]
})
</script>

<style scoped>

</style>
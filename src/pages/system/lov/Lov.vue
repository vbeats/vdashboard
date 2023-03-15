<template>
  <el-dialog
      v-model="props.visible"
      :close-on-click-modal="false"
      destroy-on-close
      title="值集配置"
      width="60%"
      @opened="afterModalOpen"
      @close="closeModal"
  >
    <avue-crud ref="lovRef" v-model:page="page" v-model:search="search" :data="lovs" :option="option" :permission="permission" :table-loading="loading"
               @refresh-change="listLovs" @search-change="listLovs" @size-change="listLovs" @current-change="listLovs"
               @row-save="addLovItem" @row-update="updateLovItem" @row-del="delLovItem"
    >

      <template #category="scope">
        {{ category }}
      </template>

    </avue-crud>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {checkPerms} from "../../../util/permission"
import {useRoute} from "vue-router"
import {addLov, deleteLov, listLov, updateLov} from "../../../api/lov"
import {ElMessage} from "element-plus";

const props = defineProps({
  visible: {
    type: Boolean,
    required: false,
    default: false
  },
  merchantId: {
    type: String,
    required: true
  },
  lovCategoryId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['closeModal'])
const route = useRoute()

const search = ref({
  key: ''
})

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const lovRef = ref()
const lovs = ref([])
const loading = ref(true)

const listLovs = async (param?: any, done?: any) => {
  loading.value = true
  const res = await listLov({
    current: page.value.currentPage,
    pageSize: page.value.pageSize,
    lovCategoryId: props.lovCategoryId,
    key: search.value.key
  })
  lovs.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

const addLovItem = async (row: any, done: any, loading: any) => {
  const res = await addLov({
    ...row,
    lovCategoryId: props.lovCategoryId
  })
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listLovs()
  }, 800)
}

const updateLovItem = async (row: any, index: any, done: any, loading: any) => {
  await updateLov({...row})
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listLovs()
  }, 800)
}

const delLovItem = async (row: any, index: any, done: any, loading: any) => {
  lovRef.value.$confirm(`确定删除${row.key}?`, {type: 'warning'})
      .then(async () => {
        await deleteLov({...row})
        ElMessage.success({message: '删除成功'})
        setTimeout(async () => {
          done()
          await listLovs()
        }, 800)
      }).catch(() => {
  })
}


const afterModalOpen = async () => {
  await listLovs()
}

const closeModal = () => {
  emit('closeModal')
}

const permission = ref({
  addBtn: checkPerms(route, 'admin.lov.add'),
  editBtn: checkPerms(route, 'admin.lov.edit'),
  delBtn: checkPerms(route, 'admin.lov.del'),
})
const option = ref({
  border: true,
  menuWidth: 180,
  column: [
    {
      label: '分组',
      prop: 'category',
      slot: true,
      disabled: true,
      value: props.category
    },
    {
      label: '键',
      prop: 'key',
      search: true,
      editDisabled: true,
      rules: [
        {required: true, message: '键不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '值',
      prop: 'value',
      rules: [
        {required: true, message: '值不能为空', trigger: 'blur'}
      ]
    },
    {
      label: '备注',
      prop: 'remark',
      overHidden: true,
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
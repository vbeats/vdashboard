<template>
  <el-row :gutter="12">
    <el-col v-show="showMerchant" :span="4">
      <el-card>
        <merchant @change-merchant="onMerchantChange"/>
      </el-card>
    </el-col>
    <el-col :span="showMerchant?20:24">
      <avue-crud ref="lovRef" v-model="form" v-model:page="page" v-model:search="search" :before-open="beforeOpen" :data="categories"
                 :option="option" :permission="permission"
                 :table-loading="loading" @refresh-change="listLovCategory"
                 @search-change="listLovCategory" @size-change="listLovCategory" @current-change="listLovCategory"
                 @row-save="addLovCategory" @row-update="updateLovCategory" @row-del="delLovCategory"
      >

        <template #menu-left="{size}">
          <el-button v-if="checkRoles('super_admin')" :size="size" icon="lock" type="warning" @click.stop="lovDefaultConfig">默认值集配置</el-button>
        </template>

        <template #menu="{type,size,row}">
          <el-button v-if="checkPerms(route,'admin.lov.add')" :size="size" :type="type" icon="el-icon-connection" text @click.stop="lovConfig(row)">值集配置</el-button>
        </template>

      </avue-crud>
    </el-col>
  </el-row>

  <!--   默认值集配置     -->
  <lov-default :visible="lovDefaultVisible" v-if="lovDefaultVisible" @close-modal="closeLovModal"/>


  <!--   值集配置     -->
  <Lov :visible="lovVisible" :merchant-id="merchantId" :category="category" :lov-category-id="lovCategoryId" v-if="lovVisible" @close-modal="closeLovModal"/>
</template>

<script lang="ts" name="lov" setup>
import Merchant from '../../../components/merchant/index.vue'
import setTitle from '../../../util/title'
import {useRoute} from "vue-router"
import {ref, watchEffect} from "vue";
import {addCategory, deleteCategory, listCategory, updateCategory} from "../../../api/lov"
import {listMerchantTree} from "../../../api/merchant"
import {checkPerms, checkRoles} from "../../../util/permission"
import {useMerchantStore} from "../../../store/merchant"
import {ElMessage} from "element-plus"
import Lov from "./Lov.vue"
import LovDefault from "./LovDefault.vue";

setTitle()

const merchantStore = useMerchantStore()
const route = useRoute()
const categories = ref([])
const search = ref({
  category: ''
})

const lovRef = ref()
const form = ref()

const loading = ref(true)
const merchantId = ref()
const merchantName = ref()
const showMerchant = ref(merchantStore.merchantState.show)
const formType = ref('add')
const lovVisible = ref(false)
const lovDefaultVisible = ref(false)
const lovCategoryId = ref()
const category = ref()

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listLovCategory = async (param?: any, done?: any) => {
  loading.value = true
  const res = await listCategory({
    current: page.value.currentPage,
    pageSize: page.value.pageSize,
    merchantId: merchantId.value,
    category: search.value.category
  })
  categories.value = res.data.rows || []
  page.value.total = res.data.total || 0
  loading.value = false
  done && done()
}

await listLovCategory()

watchEffect(async () => {
  merchantId.value = merchantStore.merchantState.merchantId
  merchantName.value = merchantStore.merchantState.merchantName
  showMerchant.value = merchantStore.merchantState.show
})

const onMerchantChange = async (param: any) => {
  merchantId.value = param.merchantId
  await listLovCategory()
}

const beforeOpen = async (done: any, type: any) => {
  formType.value = type
  if ('add' === type && !merchantId.value) {
    ElMessage.warning({message: '请先选择商户'})
    return
  }
  const res = await listMerchantTree()
  option.value.column.filter(v => {
    if (v.prop === 'merchant') {
      v.dicData = [{label: merchantName.value, value: merchantId.value}]
      v.value = merchantName.value
    }
  })
  done && done()
}

const addLovCategory = async (row: any, done: any, loading: any) => {
  const res = await addCategory({
    ...row,
    merchantId: merchantId.value
  })
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listLovCategory()
  }, 800)
}

const updateLovCategory = async (row: any, index: any, done: any, loading: any) => {
  await updateCategory({...row})
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listLovCategory()
  }, 800)
}

const delLovCategory = async (row: any, index: any, done: any, loading: any) => {
  lovRef.value.$confirm(`确定删除${row.category}?`, {type: 'warning'})
      .then(async () => {
        await deleteCategory({...row})
        ElMessage.success({message: '删除成功'})
        setTimeout(async () => {
          done()
          await listLovCategory()
        }, 800)
      }).catch(() => {
  })
}

// 值集配置
const lovConfig = (row: any) => {
  category.value = row.category
  lovCategoryId.value = row.id
  lovVisible.value = true
}

const lovDefaultConfig = (row: any) => {
  lovDefaultVisible.value = true
}

const closeLovModal = () => {
  category.value = ''
  lovCategoryId.value = ''
  lovVisible.value = false
  lovDefaultVisible.value = false
}

const permission = ref({
  addBtn: checkPerms(route, 'admin.lov.add'),
  editBtn: checkPerms(route, 'admin.lov.edit'),
  delBtn: checkPerms(route, 'admin.lov.del'),
})
const option = ref({
  border: true,
  addBtnText: '新增分组',
  menuWidth: 380,
  dialogWidth: '50%',
  column: [
    {
      label: '所属商户',
      prop: 'merchant',
      type: 'select',
      dicData: [{label: merchantName.value, value: merchantId.value}],
      value: merchantName.value,
      hide: true,
      disabled: true,
      addDisplay: true,
      editDisplay: false,
    },
    {
      label: '所属商户',
      prop: 'merchantName',
      slot: true,
      disabled: true,
      addDisplay: false,
      editDisplay: true,
    },
    {
      label: '分组',
      prop: 'category',
      search: true,
      editDisabled: true,
      rules: [
        {required: true, message: '分组不能为空', trigger: 'blur'}
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

<style lang="stylus" scoped>

</style>
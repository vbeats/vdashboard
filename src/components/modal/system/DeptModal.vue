<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增部门' : '更新部门'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="tenant_id" label="所属租户" v-if="user.type === adminType">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户">
          <a-select-option v-for="item in props.tenants" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" label="部门名称">
        <a-input v-model:value.trim="formState.name" placeholder="部门名称" />
      </a-form-item>
      <a-form-item label="上级部门" name="pid">
        <a-tree-select
          v-model:value="formState.pname"
          placeholder="上级部门"
          show-search
          :dropdown-style="{maxHeight: '500px', overflow: 'auto'}"
          allow-clear
          :tree-data="props.deptList"
          :field-names="{children: 'children', label: 'name', key: 'id', value: 'id'}"
          tree-node-filter-prop="name"
          @change="handleSelectMenu"
          :disabled="mode === 'update'"
        />
      </a-form-item>
      <a-form-item name="sort" label="顺序">
        <a-input-number v-model:value="formState.sort" placeholder="顺序" />
      </a-form-item>
      <a-form-item name="type" label="类型">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="0">公司部门</a-radio>
          <a-radio :value="1">机构/公司</a-radio>
          <a-radio :value="2">小组</a-radio>
          <a-radio :value="3">其它</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="contact_name" label="联系人">
        <a-input v-model:value.trim="formState.contact_name" placeholder="联系人" />
      </a-form-item>
      <a-form-item name="contact_phone" label="联系方式">
        <a-input v-model:value.trim="formState.contact_phone" placeholder="联系方式" />
      </a-form-item>
      <a-form-item name="remark" label="备注">
        <a-input v-model:value.trim="formState.remark" placeholder="备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {UserType} from '@/util/const'
import {deepCopy} from '@/util/util'

interface FormState {
  id?: string
  tenant_id: string
  name: string
  pid?: string
  pname?: string
  type: number
  sort: number
  contact_name?: string
  contact_phone?: string
  remark?: string
}

const user = useStore().getters.getUserInfo
const adminType = UserType.ADMIN

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultDept = {
  tenant_id: user.tenant_id,
  name: '',
  type: 0,
  sort: 0,
}
const formState: UnwrapRef<FormState> = reactive({...defaultDept})

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: false,
  },
  tenants: {
    type: Array,
    required: true,
  },
  deptList: {
    type: Array,
    required: false,
  },
})

const rules = {
  tenant_id: [{required: true, message: '不能为空', trigger: 'blur'}],
  name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
  sort: [{type: 'number', required: true, message: '顺序不能为空', trigger: 'blur'}],
  type: [{type: 'number', required: true, message: '类型不能为空', trigger: 'blur'}],
}

const handleSelectMenu = (value: string) => {
  formState.pid = value
}

const handleOk = () => {
  formRef.value &&
    formRef.value.validate().then(() => {
      emit('handleOk', toRaw(formState))
    })
}

const handleCancel = () => {
  formRef.value.resetFields()
  emit('handleCancel')
}

watchEffect(() => {
  const item = props.item
  if (props.mode === 'update' && item) {
    deepCopy(item, formState)
  } else {
    deepCopy(defaultDept, formState)
  }
})
</script>

<style scoped lang="stylus"></style>

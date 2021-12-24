<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增角色' : '更新角色'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="tenant_id" label="所属租户" v-if="user.type === adminType">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户">
          <a-select-option v-for="item in props.tenants" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="name" label="角色名称">
        <a-input v-model:value.trim="formState.name" placeholder="角色名" />
      </a-form-item>
      <a-form-item name="action" label="权限字段">
        <a-input v-model:value.trim="formState.action" placeholder="权限字段" />
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
  name: string
  action?: string
  tenant_id: string
}

const user = useStore().getters.getUserInfo
const adminType = UserType.ADMIN

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultRole = {name: '', tenant_id: user.tenant_id}
const formState: UnwrapRef<FormState> = reactive({...defaultRole})

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
})

const rules = {
  name: [{required: true, message: '租户名不能为空', trigger: 'blur'}],
  tenant_id: [{required: true, message: '租户不能为空', trigger: 'blur'}],
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
    deepCopy(defaultRole, formState)
  }
})
</script>

<style scoped lang="stylus"></style>

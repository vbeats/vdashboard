<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增租户' : '更新租户'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="name" label="租户名称">
        <a-input v-model:value.trim="formState.name" placeholder="租户名" />
      </a-form-item>
      <a-form-item name="code" label="租户编号" v-if="mode === 'update'">
        <a-input v-model:value="formState.code" placeholder="租户编号" :disabled="mode === 'update'" />
      </a-form-item>
      <a-form-item name="contact_name" label="联系人">
        <a-input v-model:value.trim="formState.contact_name" placeholder="联系人" />
      </a-form-item>
      <a-form-item name="contact_phone" label="联系方式">
        <a-input v-model:value.trim="formState.contact_phone" placeholder="联系方式" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {deepCopy} from '@/util/util'

interface FormState {
  id?: string
  name: string
  code?: string
  contact_name: string
  contact_phone: string
}

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultTenant = {name: '', contact_name: '', contact_phone: ''}
const formState: UnwrapRef<FormState> = reactive({...defaultTenant})

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
})

const rules = {
  name: [{required: true, message: '租户名不能为空', trigger: 'blur'}],
  contact_name: [{required: true, message: '联系人不能为空', trigger: 'blur'}],
  contact_phone: [{required: true, message: '联系方式不能为空', trigger: 'blur'}],
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
    deepCopy(item, formState)
  }
})
</script>

<style scoped lang="stylus"></style>

<template>
  <a-modal :title="action==='add'?'新增租户':'更新租户信息'" :visible="visible" :width="500" destroy-on-close
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="租户名" name="name">
        <a-input v-model:value="formState.name" placeholder="租户名"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect } from 'vue'

interface FormState {
  id?: string,
  name?: string
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  action: {
    type: String,
    required: false,
    default: 'add'
  },
  data: {
    type: Object,
    required: false
  }
})

const formState: UnwrapRef<FormState> = reactive({ })

const formRef = ref()
const emit = defineEmits(['cancel', 'handleAddOrUpdateTenant'])

const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  formRef.value && formRef.value
    .validate()
    .then(() => {
      emit('handleAddOrUpdateTenant', toRaw(formState))
    })
}

watchEffect(() => {
  const d = props.data
  if (d?.id && d?.id !== '') {
    formState.id = d?.id
    formState.name = d?.name
  } else {
    formState.id = undefined
    formState.name = undefined
  }
})

const rules = {
  name: [
    {
      required: true,
      message: '租户名不能为空',
      trigger: 'blur'
    },
    {
      min: 4,
      message: '不能少于4个字符',
      trigger: 'blur'
    }
  ]
}

</script>

<style scoped>

</style>

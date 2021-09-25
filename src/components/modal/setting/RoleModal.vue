<template>
  <a-modal :title="action==='add'?'新增角色':'更新角色'" :visible="visible" :width="500" destroy-on-close
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="角色名" name="role_name">
        <a-input v-model:value="formState.role_name" placeholder="角色名"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="所属租户" name="tenant_id">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户" :disabled="action==='update'">
          <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect } from 'vue'

interface FormState {
  id?: number,
  role_name?: string,
  tenant_id:string
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
  },
  tenants: {
    type: Array,
    required: true
  }
})

const formState: UnwrapRef<FormState> = reactive({ tenant_id: '' })

const formRef = ref()
const emit = defineEmits(['cancel', 'handleAddOrUpdateRole'])

const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  formRef.value && formRef.value
    .validate()
    .then(() => {
      emit('handleAddOrUpdateRole', toRaw(formState))
    })
}

watchEffect(() => {
  const d = props.data
  if (d?.id && d?.id !== '') {
    formState.id = d?.id
    formState.role_name = d?.role_name
    formState.tenant_id = d?.tenant_id
  } else {
    formState.id = undefined
    formState.role_name = undefined
    formState.tenant_id = undefined
  }
})

const rules = {
  role_name: [
    {
      required: true,
      message: '角色名不能为空',
      trigger: 'blur'
    }
  ],
  tenant_id: [
    {
      required: true,
      message: '租户名不能为空',
      trigger: 'blur'
    }
  ]
}

</script>

<style scoped>

</style>

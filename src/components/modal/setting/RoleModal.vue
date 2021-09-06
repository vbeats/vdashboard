<template>
  <a-modal :title="action==='add'?'新增角色':'更新角色'" :visible="visible" :width="500" destroy-on-close
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="角色名" name="name">
        <a-input v-model:value="formState.name" placeholder="角色名"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect } from 'vue'

interface FormState {
  id?: number,
  name?: string,
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

const formState: UnwrapRef<FormState> = reactive({})

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
  if (d?.id > 0) {
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
      message: '角色名不能为空',
      trigger: 'blur'
    }
  ]
}

</script>

<style scoped>

</style>

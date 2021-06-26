<template>
  <a-modal :visible="visible" :title="action==='add'?'新增租户':'更新租户'" @ok="handleOk" @cancel="handleCancel"
           destroy-on-close>
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="code" :wrapperCol="{span:18}" label="租户编号" :label-col="{span:4}" v-if="action==='update'">
        <a-input v-model:value="formState.code" disabled/>
      </a-form-item>
      <a-form-item name="name" :wrapperCol="{span:18}" label="租户名" :label-col="{span:4}">
        <a-input v-model:value="formState.name" placeholder="租户名"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRaw, UnwrapRef, watch} from 'vue'

interface FormState {
  id?: number,
  code?: string,
  name?: string,
}

export default defineComponent({
  name: "TenantModal",
  emits: ['cancel', 'handleTenant'],
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    action: {
      type: String,
      required: false,
      default: 'add'
    },
    data: {type: Object, required: false}
  },
  setup(props, {emit}) {

    const formRef = ref()

    const formState: UnwrapRef<FormState> = reactive({})

    watch(() => props.action, (newVal) => {
      if (newVal === 'update') {
        const item: any = props.data
        formState.id = item.id
        formState.code = item.code
        formState.name = item.name
      } else {
        formState.id = undefined
        formState.code = ''
        formState.name = ''
      }
    })

    const rules = {
      name: [
        {required: true, message: '租户名不能为空', trigger: 'blur'},
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handleTenant', toRaw(formState))
            setTimeout(() => formRef.value.resetFields(), 1000)
          })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    return {
      formRef, formState,
      handleOk, handleCancel, rules
    }
  }
})
</script>

<style scoped>

</style>
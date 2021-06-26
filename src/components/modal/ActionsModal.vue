<template>
  <a-modal :visible="visible" :title="action==='add'?'新增Action':'更新Action'" @ok="handleOk" @cancel="handleCancel"
           destroy-on-close>
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="api" :wrapperCol="{span:18}" label="api接口" :label-col="{span:5}">
        <a-input v-model:value="formState.api" placeholder="api接口"/>
      </a-form-item>
      <a-form-item name="action" :wrapperCol="{span:18}" label="权限字段" :label-col="{span:5}">
        <a-input v-model:value="formState.action" placeholder="action权限字段"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRaw, UnwrapRef, watch} from 'vue'

interface FormState {
  id?: number,
  api?: string,
  action?: string,
}

export default defineComponent({
  name: "ActionsModal",
  emits: ['cancel', 'handle_action'],
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
        formState.api = item.api
        formState.action = item.action
      } else {
        formState.id = undefined
        formState.api = ''
        formState.action = ''
      }
    })

    const rules = {
      api: [
        {required: true, message: 'api接口不能为空', trigger: 'blur'},
      ],
      action: [
        {required: true, message: '权限字段不能为空', trigger: 'blur'},
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handle_action', toRaw(formState))
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
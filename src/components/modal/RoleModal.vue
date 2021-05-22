<template>
  <a-modal :visible="visible" title="新增角色" @ok="handleOk" @cancel="handleCancel">
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="role_name" :wrapperCol="{span:18}" label="角色名" :label-col="{span:4}">
        <a-input v-model:value="formState.role_name" placeholder="角色名"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRaw, UnwrapRef} from 'vue'
import {RoleFormState} from "@/interface/setting/user";

export default defineComponent({
  name: "RoleModal",
  emits: ['cancel', 'handleRole'],
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    data: {type: Object, required: false}
  },
  setup(props, {emit}) {

    const formRef = ref()

    const formState: UnwrapRef<RoleFormState> = reactive({
      role_name: ''
    })

    const rules = {
      role_name: [
        {required: true, message: '角色不能为空', trigger: 'blur'},
      ],
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handleRole', toRaw(formState))
          })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    return {
      formRef, formState,
      handleOk, handleCancel, rules,
    }
  }
})
</script>

<style scoped>

</style>
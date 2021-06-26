<template>
  <a-modal :visible="visible" title="新增角色" @ok="handleOk" @cancel="handleCancel" destroy-on-close>
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="role_name" :wrapperCol="{span:18}" label="角色名" :label-col="{span:4}">
        <a-input v-model:value="formState.role_name" placeholder="角色名"/>
      </a-form-item>
      <a-form-item name="tid" :wrapperCol="{span:18}" label="租户" :label-col="{span:4}">
        <a-select v-model:value="formState.tid" placeholder="选择租户" @select="handleSelectTenant">
          <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}
          </a-select-option>
        </a-select>
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
    tenants: {
      type: Array
    }
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
      tid: [
        {type: 'number', required: true, message: '租户不能为空', trigger: 'blur'}
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handleRole', toRaw(formState))
            setTimeout(() => formRef.value.resetFields(), 500)
          })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    const handleSelectTenant = (id: number) => {
      console.log(id)
    }

    return {
      formRef, formState,
      handleOk, handleCancel, rules, handleSelectTenant
    }
  }
})
</script>

<style scoped>

</style>
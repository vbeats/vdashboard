<template>
  <a-modal :visible="visible" title="修改密码" @cancel="handleCancel" @ok="handleOk">
    <a-form
        ref="formRef"
        :model="formState"
        :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="密码" name="password">
        <a-input v-model:value="formState.password" placeholder="密码" type="password"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, UnwrapRef} from 'vue'
import {updateUserSelf} from "@/api/setting";
import encrypt from "@/utils/crypto";
import {message} from "ant-design-vue";

interface FormState {
  password: string;
}

export default defineComponent({
  name: "UserInfoModal",
  emits: ['cancel', 'handleUser'],
  props: {
    visible: {
      type: Boolean,
      required: true
    },
  },
  setup(props, {emit}) {

    const formRef = ref()

    const formState: UnwrapRef<FormState> = reactive({
      password: ''
    })

    const rules = {
      password: [
        {required: true, message: '密码不能为空', trigger: 'blur'},
        {
          pattern: '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$',
          message: '至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
          trigger: 'blur'
        },
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            updateUserSelf({password: encrypt(formState.password)}).then(() => {
              message.success('修改成功')
              setTimeout(() => {
                handleCancel()
              }, 800)
            })
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
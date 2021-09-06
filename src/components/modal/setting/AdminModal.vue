<template>
  <a-modal :title="action==='add'?'新增用户':'更新用户信息'" :visible="visible" :width="500" destroy-on-close
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="用户名" name="username">
        <a-input v-model:value="formState.username" placeholder="用户名"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="密码" name="password">
        <a-input v-model:value="formState.password" placeholder="密码" type="password"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="手机号" name="phone">
        <a-input v-model:value="formState.phone" placeholder="手机号"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect } from 'vue'
import { RuleObject } from 'ant-design-vue/es/form/interface'

interface FormState {
  id?: number,
  username?: string,
  password?: string,
  phone?: string,
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
const emit = defineEmits(['cancel', 'handleAddOrUpdateAdmin'])

const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  formRef.value && formRef.value
    .validate()
    .then(() => {
      emit('handleAddOrUpdateAdmin', toRaw(formState))
    })
}

watchEffect(() => {
  const d = props.data
  if (d?.id > 0) {
    formState.id = d?.id
    formState.username = d?.username
    formState.password = d?.password
    formState.phone = d?.phone
  } else {
    formState.id = undefined
    formState.username = undefined
    formState.password = undefined
    formState.phone = undefined
  }
})

const checkPassword = async (rule: RuleObject, value: string): Promise<any> => {
  const pattern = '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$'
  const regex = new RegExp(pattern)
  if ((!formState.id || formState.id === 0) && (
    !value || !regex.test(value))) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
  } else if (formState.id && formState.id > 0 && value && !regex.test(value)) {
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'
    },
    {
      min: 5,
      message: '不能少于5个字符',
      trigger: 'blur'
    }
  ],
  password: [
    {
      validator: checkPassword,
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: false,
      trigger: 'blur'
    },
    {
      pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
      message: '手机号错误',
      trigger: 'blur'
    }
  ]
}

</script>

<style scoped>

</style>

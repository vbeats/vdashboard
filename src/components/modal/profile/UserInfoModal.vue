<template>
  <a-modal :visible="visible" title="更新用户信息" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="account" label="账号">
        <a-input v-model:value.trim="formState.account" disabled />
      </a-form-item>
      <a-form-item name="nick_name" label="昵称">
        <a-input v-model:value.trim="formState.nick_name" />
      </a-form-item>
      <a-form-item name="phone" label="联系方式">
        <a-input v-model:value.trim="formState.phone" />
      </a-form-item>
      <a-form-item name="gender" label="性别">
        <a-radio-group v-model:value="formState.gender">
          <a-radio :value="0">未知</a-radio>
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="password" label="密码">
        <a-input-password v-model:value.trim="formState.password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef} from 'vue'
import {RuleObject} from 'ant-design-vue/es/form'

interface FormState {
  account: string
  nick_name: string
  gender: number
  phone: string
  password: string
}

const formRef = ref()
const emit = defineEmits(['handleOk', 'handleCancel'])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object,
    required: false,
  },
})

const user = {
  account: props.item?.account,
  nick_name: props.item?.nick_name,
  gender: props.item?.gender,
  phone: props.item?.phone,
  password: '',
}
const formState: UnwrapRef<FormState> = reactive({...user})

const checkPassword = async (rule: RuleObject, value: string): Promise<any> => {
  const pattern = '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$'
  const regex = new RegExp(pattern)
  if (value && !regex.test(value)) {
    return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  nick_name: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
  phone: [
    {required: true, message: '联系方式不能为空', trigger: 'blur'},
    {
      pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
      message: '手机号错误',
      trigger: 'blur',
    },
  ],
  gender: [{type: 'number', required: true, message: '性别不能为空', trigger: 'blur'}],
  password: [{validator: checkPassword, trigger: 'blur'}],
}
const handleOk = () => {
  formRef.value &&
    formRef.value.validate().then(() => {
      const params = toRaw(formState)
      emit('handleOk', {...params})
    })
}

const handleCancel = () => {
  formRef.value.resetFields()
  emit('handleCancel')
}
</script>

<style scoped lang="stylus"></style>

<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增用户' : '更新用户'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="tenant_id" label="所属租户" v-if="user.type === adminType">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户" :disabled="mode === 'update'">
          <a-select-option v-for="item in props.tenants" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="account" label="账号">
        <a-input v-model:value.trim="formState.account" placeholder="账号" />
      </a-form-item>
      <a-form-item name="password" label="密码">
        <a-input-password v-model:value.trim="formState.password" />
      </a-form-item>
      <a-form-item name="nick_name" label="昵称">
        <a-input v-model:value.trim="formState.nick_name" placeholder="昵称" />
      </a-form-item>
      <a-form-item name="phone" label="手机号">
        <a-input v-model:value.trim="formState.phone" placeholder="手机号" />
      </a-form-item>
      <a-form-item name="gender" label="性别">
        <a-radio-group v-model:value="formState.gender">
          <a-radio :value="0">未知</a-radio>
          <a-radio :value="1">男</a-radio>
          <a-radio :value="2">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {useStore} from 'vuex'
import {RuleObject} from 'ant-design-vue/es/form'
import {UserType} from '@/util/const'
import {deepCopy} from '@/util/util'

interface FormState {
  id?: string
  tenant_id: string
  account: string
  password?: string
  nick_name: string
  phone: string
  gender: number
  avatar?: string
}

const user = useStore().getters.getUserInfo
const adminType = UserType.ADMIN

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultUser = {
  account: '',
  tenant_id: user.tenant_id,
  nick_name: '',
  phone: '',
  gender: 0,
}
const formState: UnwrapRef<FormState> = reactive({...defaultUser})

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: false,
  },
  tenants: {
    type: Array,
    required: true,
  },
})

const checkPassword = async (rule: RuleObject, value: string): Promise<any> => {
  const pattern = '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$'
  const regex = new RegExp(pattern)
  if ((value && !regex.test(value)) || (props.mode === 'add' && !regex.test(value))) {
    return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  tenant_id: [{required: true, message: '租户不能为空', trigger: 'blur'}],
  account: [{required: true, message: '账号不能为空', trigger: 'blur'}],
  nick_name: [{required: true, message: '不能为空', trigger: 'blur'}],
  phone: [
    {required: true, message: '不能为空', trigger: 'blur'},
    {
      pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
      message: '手机号错误',
      trigger: 'blur',
    },
  ],
  gender: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
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

watchEffect(() => {
  const item = props.item
  formState.password = ''
  if (props.mode === 'update' && item) {
    deepCopy(item, formState)
  } else {
    deepCopy(defaultUser, formState)
    formState.gender = 0
  }
})
</script>

<style scoped lang="stylus"></style>

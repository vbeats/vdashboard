<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增Client' : '更新Client'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false" :width="800">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 6}" label-align="left">
      <a-form-item name="client_id" label="client id">
        <a-input v-model:value.trim="formState.client_id" placeholder="client id" />
      </a-form-item>
      <a-form-item name="secret" label="secret">
        <a-input v-model:value.trim="formState.secret" placeholder="secret" />
      </a-form-item>
      <a-form-item name="grant_type" label="认证类型">
        <a-checkbox-group v-model:value="grantType" name="grant_type" :options="['code', 'password', 'refresh_token', 'wechat']" />
      </a-form-item>
      <a-form-item name="scope" label="scope">
        <a-radio-group v-model:value="formState.scope" name="scope">
          <a-radio value="all">all</a-radio>
          <a-radio value="basic_info">basic_info</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="platform" label="平台类型">
        <a-radio-group v-model:value="formState.platform" name="platform">
          <a-radio :value="0">WEB</a-radio>
          <a-radio :value="1">APP</a-radio>
          <a-radio :value="2">小程序</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="redirect_url" label="重定向URL">
        <a-input v-model:value.trim="formState.redirect_url" placeholder="redirect url" />
      </a-form-item>
      <a-form-item name="access_token_expire" label="access_token有效时间(s)">
        <a-input v-model:value.trim="formState.access_token_expire" placeholder="access_token有效时间 s" />
      </a-form-item>
      <a-form-item name="refresh_token_expire" label="refresh_token有效时间(s)">
        <a-input v-model:value.trim="formState.refresh_token_expire" placeholder="refresh_token有效时间 s" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {deepCopy} from '@/util/util'

interface FormState {
  id?: string
  client_id: string
  secret: string
  grant_type: string
  scope: string
  platform: number
  access_token_expire: number
  refresh_token_expire: number
  redirect_url?: string
}

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultOauth = {
  client_id: '',
  secret: '',
  grant_type: '',
  scope: 'all',
  platform: 0,
  access_token_expire: 7200,
  refresh_token_expire: 2592000,
  redirect_url: '',
}
const formState: UnwrapRef<FormState> = reactive({...defaultOauth})

const grantType = ref([])

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
})

const rules = {
  client_id: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 32}],
  secret: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 64}],
  grant_type: [{required: true, message: '不能为空', trigger: 'blur'}],
  scope: [{required: true, message: '不能为空', trigger: 'blur'}],
  platform: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
  access_token_expire: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
      type: 'number',
      transform: (v: string) => parseInt(v),
    },
  ],
  refresh_token_expire: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
      type: 'number',
      transform: (v: string) => parseInt(v),
    },
  ],
}
const handleOk = () => {
  formRef.value &&
    formRef.value.validate().then(() => {
      emit('handleOk', toRaw(formState))
    })
}

const handleCancel = () => {
  formRef.value.resetFields()
  emit('handleCancel')
}

watchEffect(() => {
  const types = grantType.value
  if (types && types.length > 0) {
    formState.grant_type = types.join(',')
  }
})

watchEffect(() => {
  const item = props.item
  if (props.mode === 'update' && item) {
    deepCopy(item, formState)
    grantType.value = item.grant_type && item.grant_type.split(',')
  } else {
    deepCopy(defaultOauth, formState)
    grantType.value = []
  }
})
</script>

<style scoped lang="stylus"></style>

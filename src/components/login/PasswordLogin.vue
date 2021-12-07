<template>
  <a-form ref="formRef" :model="formState" :rules="rules" :wrapperCol="wrapperCol">
    <a-form-item name="tenant_code" v-show="show_tenant">
      <a-input v-model:value.trim="formState.tenant_code" placeholder="租户编号" size="large" :autofocus="show_tenant">
        <template #prefix>
          <KeyOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="account">
      <a-input v-model:value.trim="formState.account" placeholder="账号" size="large" :autofocus="!show_tenant">
        <template #prefix>
          <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="password">
      <a-input-password v-model:value.trim="formState.password" placeholder="密码" size="large">
        <template #prefix>
          <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item name="captcha">
      <a-row align="middle" type="flex">
        <a-col :span="12">
          <a-input v-model:value.trim="formState.captcha" placeholder="验证码" size="large" @blur="checkCaptcha" @keyup.enter="submit" />
        </a-col>
        <a-col :offset="2" :span="10">
          <a-image :src="formState.img" alt="" width="100%" class="w-full cursor-pointer h-14" :preview="false" :fallback="CaptchaSvg" @click="refreshCaptcha" />
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disabled" block size="large" type="primary" @click="submit">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, onMounted, reactive, ref, toRefs, UnwrapRef} from 'vue'
import {KeyOutlined, LockOutlined, UserOutlined} from '@ant-design/icons-vue'
import CaptchaSvg from '@/assets/img/captcha.svg'
import {getCaptcha} from '@/api/auth'

interface FormState {
  tenant_code: string
  account: string
  password: string
  captcha: string
  key: string
  img: string
}

export default defineComponent({
  name: 'PasswordLogin',
  components: {
    UserOutlined,
    LockOutlined,
    KeyOutlined,
  },
  setup(props, {emit}) {
    const formState: UnwrapRef<FormState> = reactive({
      tenant_code: process.env.VUE_APP_SHOW_TENANT === 'true' ? '' : process.env.VUE_APP_TENANT,
      account: '',
      password: '',
      captcha: '',
      key: '',
      img: '',
    })
    const data: any = reactive({
      disabled: false,
      show_tenant: process.env.VUE_APP_SHOW_TENANT === 'true',
    })
    const rules = {
      tenant_code: [
        {
          required: true,
          message: '租户编号必填',
          trigger: 'blur',
        },
      ],
      account: [
        {
          required: true,
          message: '账号必填',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '密码必填',
          trigger: 'blur',
        },
      ],
      captcha: [
        {
          required: true,
          message: '验证码必填',
          trigger: 'blur',
        },
        {
          len: 5,
          message: '验证码错误',
          trigger: 'blur',
        },
      ],
    }
    const formRef = ref<DefineComponent | null>(null)
    // 提交表单
    const submit = () => {
      formRef.value &&
        formRef.value.validate().then(() => {
          data.disabled = true
          emit('login', {
            ...formState,
            grant_type: 'PASSWORD',
          })
        })
    }
    // 校验
    const checkCaptcha = () => {
      formRef.value && formRef.value.validateFields('captcha')
    }
    // 获取验证码
    const getCaptchaImg = () => {
      formState.captcha = ''
      getCaptcha().then((res) => {
        formState.img = res.data.image
        formState.key = res.data.key
        data.disabled = false
      })
    }
    onMounted(() => {
      getCaptchaImg()
    })
    // 刷新验证码
    const refreshCaptcha = () => {
      getCaptchaImg()
    }

    return {
      CaptchaSvg,
      formState,
      ...toRefs(data),
      rules,
      submit,
      formRef,
      checkCaptcha,
      refreshCaptcha,
      wrapperCol: {span: 22},
    }
  },
})
</script>

<style lang="stylus" scoped></style>

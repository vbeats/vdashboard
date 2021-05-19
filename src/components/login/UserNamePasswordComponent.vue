<template>
  <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :wrapperCol="wrapperCol"
  >

    <a-form-item name="tenant" v-show="showTenant">
      <a-input v-model:value="formState.tenant" size="large" placeholder="租户编号">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="username">
      <a-input v-model:value="formState.username" size="large" placeholder="账号">
        <template #prefix>
          <UserOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="password">
      <a-input-password v-model:value="formState.password" size="large" placeholder="密码">
        <template #prefix>
          <LockOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item name="captcha">
      <a-row type="flex" align="middle">
        <a-col :span="14">
          <a-input v-model:value="formState.captcha" size="large" placeholder="验证码" @blur="checkCaptcha"
                   @keyup.enter="submit"/>
        </a-col>
        <a-col :span="8" :offset="2">
          <img :src="formState.img" alt="" class="w-full cursor-pointer h-14"
               @click="refreshCaptcha"/>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block size="large" @click="submit" :disabled="disabled">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, onMounted, reactive, ref, UnwrapRef} from 'vue'
import {LockOutlined, ShopOutlined, UserOutlined} from '@ant-design/icons-vue'
import {getCaptcha} from '@/api/user'

interface FormState {
  tenant: string,
  username: string,
  password: string,
  captcha: string,
  key: string,
  img: string
}

export default defineComponent({
  name: "UserNamePasswordComponent",
  components: {UserOutlined, LockOutlined, ShopOutlined},
  setup(props, {emit}) {
    const formState: UnwrapRef<FormState> = reactive({
      tenant: import.meta.env.VITE_APP_TENANT === 'show' ? '' : '000000',
      username: '',
      password: '',
      captcha: '',
      key: '',
      img: ''
    })

    const data: any = reactive({
      showTenant: import.meta.env.VITE_APP_TENANT === 'show',
      disabled: false
    })

    const rules = {
      tenant: [
        {required: import.meta.env.VITE_APP_TENANT === 'show', message: '租户编号必填', trigger: 'blur'},
      ],
      username: [
        {required: true, message: '账号必填', trigger: 'blur'},
      ],
      password: [
        {required: true, message: '密码必填', trigger: 'blur'},
      ],
      captcha: [
        {required: true, message: '验证码必填', trigger: 'blur'},
        {len: 5, message: "验证码错误", trigger: 'blur'}
      ],
    }

    const formRef = ref<DefineComponent | null>(null)

    // 提交表单
    const submit = () => {
      formRef.value && formRef.value
          .validate()
          .then(() => {
            data.disabled = true
            emit('login', {...formState, type: 0})
          })
    }

    // 校验
    const checkCaptcha = () => {
      formRef.value && formRef.value.validateFields('captcha')
    }

    // 获取验证码
    const getCaptchaImg = () => {
      getCaptcha().then(res => {
        formState.img = res.data.image
        formState.key = res.data.key
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
      formState,
      ...data,
      rules,
      submit,
      formRef,
      checkCaptcha,
      refreshCaptcha,
      wrapperCol: {span: 24},
    }
  }
})
</script>

<style scoped>

</style>
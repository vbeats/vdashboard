<template>
  <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :wrapperCol="wrapperCol"
  >

    <a-form-item name="tenant" :v-show="showTenant">
      <a-input v-model:value="form.tenant" size="large" placeholder="租户编号">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="username">
      <a-input v-model:value="form.username" size="large" placeholder="账号">
        <template #prefix>
          <UserOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="password">
      <a-input-password v-model:value="form.password" size="large" placeholder="密码">
        <template #prefix>
          <LockOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input-password>
    </a-form-item>

    <a-form-item name="captcha">
      <a-row>
        <a-col :span="14">
          <a-input v-model:value="form.captcha" size="large" placeholder="验证码" @blur="checkCaptcha"/>
        </a-col>
        <a-col :span="8" :offset="2">
          <img :src="form.img" alt="" style="width: 100%;height: 60px;cursor: pointer" @click="refreshCaptcha"/>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block size="large" @click="submit" :disabled="disabled">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, onMounted, reactive, ref} from 'vue'
import {LockOutlined, ShopOutlined, UserOutlined} from '@ant-design/icons-vue'
import {getCaptcha} from '@/api/user'

export default defineComponent({
  name: "UserNamePasswordComponent",
  components: {UserOutlined, LockOutlined, ShopOutlined},
  setup(props, {emit}) {
    const data: any = reactive({
      form: {
        tenant: '',
        username: '',
        password: '',
        captcha: '',
        key: '',
        img: ''
      },
      showTenant: import.meta.env.VITE_APP_TENANT === 'show',
      disabled: false
    })

    const rules = {
      tenant: [
        {required: true, message: '租户编号必填', trigger: 'blur'},
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
            emit('login', {...data.form, type: 0})
          })
    }

    // 校验
    const checkCaptcha = () => {
      formRef.value && formRef.value.validateFields('captcha')
    }

    // 获取验证码
    const getCaptchaImg = () => {
      getCaptcha().then(res => {
        data.form.img = res.data.image
        data.form.key = res.data.key
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

<style scoped lang="stylus">
#captcha
  display flex
  flex-direction row
  align-items center
</style>
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

    <a-form-item name="phone">
      <a-input v-model:value="formState.phone" size="large" placeholder="手机号">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="code">
      <a-row type="flex" align="middle">
        <a-col :span="14">
          <a-input v-model:value="formState.code" size="large" placeholder="验证码" @blur="checkCode"
                   @keyup.enter="submit"/>
        </a-col>
        <a-col :span="8" :offset="2">
          <a-button type="primary" block size="large" @click="getSmsCode" :disabled="disabled">{{ btText }}</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block size="large" @click="submit" :disabled="disLogin">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, reactive, ref, toRef, toRefs, UnwrapRef, watch} from 'vue'
import {message} from "ant-design-vue"
import {ShopOutlined} from '@ant-design/icons-vue'
import {getSmsCode as getSmsCodeApi} from '@/api/user'

interface FormState {
  tenant: string,
  phone: string,
  code: string
}

export default defineComponent({
  name: "PhoneComponent",
  components: {ShopOutlined},
  setup(props, {emit}) {

    const formState: UnwrapRef<FormState> = reactive({
      tenant: import.meta.env.VITE_APP_TENANT === 'show' ? '' : '000000',
      phone: '',
      code: ''
    })

    const data: any = reactive({
      showTenant: import.meta.env.VITE_APP_TENANT === 'show',
      disabled: true,
      btText: '获取验证码',
      smsTime: 60,
      disLogin: false
    })

    const rules = {
      tenant: [
        {required: import.meta.env.VITE_APP_TENANT === 'show', message: '租户编号必填', trigger: 'blur'},
        {len: 6, message: '租户编号错误', trigger: 'blur'}
      ],
      phone: [
        {required: true, message: '手机号必填', trigger: 'blur'},
        {
          pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
          message: '手机号错误',
          trigger: 'blur'
        },
      ],
      code: [
        {required: true, message: '验证码必填', trigger: 'blur'},
        {len: 6, message: '验证码错误', trigger: 'blur'},
      ],
    }

    const formRef = ref<DefineComponent | null>(null)

    // 表单提交
    const submit = () => {
      formRef.value && formRef.value
          .validate()
          .then(() => {
            data.disLogin = true
            emit('login', {...formState, type: 1})
          })
    }

    // 校验输入
    const checkCode = () => {
      formRef.value && formRef.value.validateFields('code')
    }

    watch([toRef(formState, 'tenant'), toRef(formState, 'phone')], (newValue) => {
      if (newValue[0].length === 6 && newValue[1].length === 11) {
        data.disabled = false
      }
    })

    // 获取短信验证码
    const getSmsCode = () => {
      if (!formState.phone || !formState.tenant || formState.tenant.length !== 6 || formState.phone.length !== 11) {
        return
      }

      getSmsCodeApi(formState.phone, formState.tenant).then(() => {
        message.success('短信已发送')
        data.disabled = true
        data.btText = data.smsTime + ' s'
        const timer = setInterval(() => {
          if (data.smsTime <= 0) {
            clearInterval(timer)
            data.disabled = false
            data.btText = '获取验证码'
            data.smsTime = 60
            return
          }
          data.btText = (data.smsTime--) + ' s';
        }, 1000)
      })
    }

    // 激活登录按钮
    const enableLoginButton = () => {
      setTimeout(() => {
        data.disLogin = false
      }, 2000)
    }

    return {
      formState, ...toRefs(data), formRef, submit,
      checkCode, getSmsCode, enableLoginButton,
      wrapperCol: {span: 24}, rules
    }
  }
})
</script>

<style scoped>

</style>
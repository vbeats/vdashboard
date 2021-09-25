<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :wrapperCol="wrapperCol"
  >
    <a-form-item name="tenant_code" v-show="show_tenant">
      <a-input v-model:value="formState.tenant_code" placeholder="租户编号" size="large">
        <template #prefix>
          <KeyOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="phone">
      <a-input v-model:value="formState.phone" placeholder="手机号" size="large">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="code">
      <a-row align="middle" type="flex">
        <a-col :span="14">
          <a-input v-model:value="formState.code" placeholder="验证码" size="large" @blur="checkCode"
                   @keyup.enter="getSmsCode"/>
        </a-col>
        <a-col :offset="2" :span="8">
          <a-button :disabled="disabled" block size="large" type="primary" @click="getSmsCode">{{ btText }}</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button :disabled="disLogin" block size="large" type="primary" @click="submit">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { DefineComponent, defineComponent, reactive, ref, toRaw, toRef, toRefs, UnwrapRef, watch } from 'vue'
import { message } from 'ant-design-vue'
import { ShopOutlined, KeyOutlined } from '@ant-design/icons-vue'
import { getSmsCode as getSmsCodeApi } from '@/api/auth'

interface FormState {
  tenant_code:string,
  phone: string,
  code: string
}

export default defineComponent({
  name: 'PhoneComponent',
  components: { ShopOutlined, KeyOutlined },
  setup (props, { emit }) {
    const formState: UnwrapRef<FormState> = reactive({
      tenant_code: process.env.VUE_APP_SHOW_TENANT === 'true' ? '' : process.env.VUE_APP_TENANT,
      phone: '',
      code: ''
    })

    const data: any = reactive({
      disabled: true,
      btText: '获取验证码',
      smsTime: 60,
      disLogin: false,
      show_tenant: process.env.VUE_APP_SHOW_TENANT === 'true'
    })

    const rules = {
      tenant_code: [
        {
          required: true,
          message: '租户编号不能为空',
          trigger: 'blur'
        }
      ],
      phone: [
        {
          required: true,
          message: '手机号必填',
          trigger: 'blur'
        },
        {
          pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
          message: '手机号错误',
          trigger: 'blur'
        }
      ],
      code: [
        {
          required: true,
          message: '验证码必填',
          trigger: 'blur'
        },
        {
          len: 6,
          message: '验证码错误',
          trigger: 'blur'
        }
      ]
    }

    const formRef = ref<DefineComponent | null>(null)

    // 表单提交
    const submit = () => {
      formRef.value && formRef.value
        .validate()
        .then(() => {
          data.disLogin = true
          emit('login', {
            ...formState,
            type: 1
          })
        })
    }

    // 校验输入
    const checkCode = () => {
      formRef.value && formRef.value.validateFields('code')
    }

    watch(toRef(formState, 'phone'), (newValue) => {
      if (newValue.length === 11) {
        data.disabled = false
      }
    })

    // 获取短信验证码
    const getSmsCode = () => {
      if (!formState.phone || formState.phone.length !== 11 || !formState.tenant_code || formState.tenant_code === '') {
        return
      }

      getSmsCodeApi({ ...toRaw(formState) }).then(() => {
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
          data.btText = (data.smsTime--) + ' s'
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
      formState,
      ...toRefs(data),
      formRef,
      submit,
      checkCode,
      getSmsCode,
      enableLoginButton,
      wrapperCol: { span: 24 },
      rules
    }
  }
})
</script>

<style lang="stylus" scoped>

</style>

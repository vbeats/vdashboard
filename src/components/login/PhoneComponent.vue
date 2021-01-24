<template>
  <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
  >

    <a-form-item name="tenant" :v-show="showTenant">
      <a-input v-model:value="form.tenant" size="large" placeholder="租户编号">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="phone">
      <a-input v-model:value="form.phone" size="large" placeholder="手机号">
        <template #prefix>
          <ShopOutlined style="color:rgba(0,0,0,.25)"/>
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="code">
      <a-row>
        <a-col :span="14">
          <a-input v-model:value="form.code" size="large" placeholder="验证码" @blur="checkCode"/>
        </a-col>
        <a-col :span="8" :offset="2">
          <a-button type="primary" block size="large" @click="getSmsCode" :disabled="disabled">{{ btText }}</a-button>
        </a-col>
      </a-row>
    </a-form-item>

    <a-form-item>
      <a-button type="primary" block size="large" @click="submit">登 录</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, reactive, ref, toRefs} from 'vue'
import {message} from "ant-design-vue"
import {ShopOutlined} from '@ant-design/icons-vue'
import {getSmsCode as getSmsCodeApi} from '@/api/user'

export default defineComponent({
  name: "PhoneComponent",
  components: {ShopOutlined},
  setup(props, {emit}) {

    const data: any = reactive({
      form: {
        tenant: '',
        phone: '',
        code: ''
      },
      rules: {
        tenant: [
          {required: true, message: '租户编号必填', trigger: 'blur'},
          {len: 6, message: '租户编号错误', trigger: 'blur'},
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
      },
      showTenant: process.env.VUE_APP_TENANT === 'show',
      disabled: false,
      btText: '获取验证码',
      smsTime: 60
    })

    const formRef = ref<DefineComponent | null>(null)

    const submit = () => {
      formRef.value && formRef.value
          .validate()
          .then(() => {
            emit('login', {...data.form, type: 1})
          })
    }

    const checkCode = () => {
      formRef.value && formRef.value.validateFields('code')
    }

    const getSmsCode = () => {
      if (!data.form.phone || !data.form.tenant || data.form.tenant.length !== 6 || data.form.phone.length !== 11) {
        message.error('参数错误', 3)
        return;
      }

      getSmsCodeApi(data.form.phone, data.form.tenant).then(() => {
        message.success('短信已发送')
        data.disabled = true
        data.btText = data.smsTime + ' s'
        setInterval(() => {
          data.btText = (data.smsTime--) + ' s'
        }, 1000)
      })
    }

    return {
      ...toRefs(data), formRef, submit, checkCode, getSmsCode
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
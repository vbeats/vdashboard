<template>
  <div class="login w-screen min-h-screen overflow-hidden flex flex-col">
    <div class="flex flex-row items-center justify-center mt-4 md:mt-36 2xl:mt-48">
      <img src="@/assets/img/logo.svg" alt="" class="w-16" />
      <span class="text-2xl font-sans ml-4">V Dashboard</span>
    </div>
    <div class="flex justify-center items-center mt-4 md:mt-16 2xl:mt-24">
      <!--  登录区域  -->
      <div class="flex items-center p-4 sm:w-full md:w-3/4 2xl:w-7/12 max-w-screen-lg bg-white rounded-lg">
        <img :src="LoginSvg" class="w-3/5 hidden lg:flex" />
        <!-- 加载中 -->
        <a-spin size="large" v-if="loading" class="w-full" />
        <!-- 表单  -->
        <div class="m-4 w-full lg:w-2/5" v-else>
          <a-tabs class="login-tabs">
            <a-tab-pane key="1" tab="账户密码登录">
              <PasswordLogin ref="unRef" @login="login" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="手机号登录">
              <PhoneLogin ref="phRef" @login="login" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </div>
    <CopyRight class="fixed bottom-4 w-screen" />
  </div>
</template>
<script lang="ts" setup>
import CopyRight from '@/components/copyright/CopyRight.vue'
import PasswordLogin from '@/components/login/PasswordLogin.vue'
import PhoneLogin from '@/components/login/PhoneLogin.vue'
import LoginSvg from '@/assets/img/login.svg'
import {DefineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'
import encrypt from '@/util/crypto'
import {getToken} from '@/api/auth'
import {loadUserProfile} from '@/util/authUtil'

interface Credentials {
  tenant_code: string
  client_id: string
  secret: string
  account?: string
  password?: string
  key?: string
  captcha?: string
  phone?: string
  sms_code?: string
  grant_type: string
  platform: string
}

const unRef = ref<DefineComponent | null>()
const phRef = ref<DefineComponent | null>()
const store = useStore()
const router = useRouter()
const loading = ref<boolean>(false)

// 用户认证
const login = (params: any): void => {
  loading.value = true
  const credentials: Credentials = {
    tenant_code: params.tenant_code,
    client_id: process.env.VUE_APP_CLIENTID,
    secret: process.env.VUE_APP_SECRET,
    grant_type: params.grant_type,
    platform: process.env.VUE_APP_PLATFORM,
  }
  switch (params.grant_type) {
    case 'PASSWORD':
      credentials.account = params.account
      credentials.password = encrypt(params.password)
      credentials.key = params.key
      credentials.captcha = params.captcha
      break
    case 'SMS':
      credentials.phone = params.phone
      credentials.sms_code = params.sms_code
      break
  }
  getToken(credentials)
    .then(async (res: any) => {
      await store.dispatch('update_userinfo', {...res.data, tenant_code: credentials.tenant_code})
      await loadUserProfile()
      await router.replace({name: 'layout'})
    })
    .catch(() => {
      unRef.value && unRef.value.refreshCaptcha()
      phRef.value && phRef.value.enableLoginButton()
      loading.value = false
    })
}
</script>

<style lang="stylus" scoped>
::v-deep(.login-tabs .ant-tabs-nav::before)
  border-bottom none !important

::v-deep(.login-tabs .ant-tabs-nav-wrap)
  justify-content center

::v-deep(.login-tabs .ant-tabs-tab)
  margin 0 2rem

.login
  background #f0f2f5 url("../../assets/img/background.svg") no-repeat 50%
</style>

<template>
  <div
    class="login w-screen h-screen bg-no-repeat bg-bg-position bg-contain bg-[#f0f2f5] overflow-hidden flex flex-col">
    <div class="w-96 mx-auto my-0">
      <div class="flex flex-col items-center">
        <div class="mt-20 flex flex-row items-center">
          <img alt="" class="w-11 h-11" src="@/assets/img/logo.svg"/>
          <span class="ml-10 text-3xl font-bold text-gray-700">Ant Design</span>
        </div>
        <span class="text-gray-400 text-sm mt-5">Ant Design 是西湖区最具影响力的 Web 设计规范</span>
      </div>

      <div class="mt-14">
        <a-tabs class="login-tabs">
          <a-tab-pane key="1" tab="账户密码登录">
            <UserNamePasswordComponent ref="unRef" @login="login"/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="手机号登录">
            <PhoneComponent ref="phRef" @login="login"/>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="mt-15">
        <CopyRight/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DefineComponent, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import UserNamePasswordComponent from '@/components/login/UserNamePasswordComponent.vue'
import PhoneComponent from '@/components/login/PhoneComponent.vue'
import CopyRight from '@/components/copyright/CopyRight.vue'
import { getToken } from '@/api/auth'
import encrypt from '@/util/crypto'
import { Credentials } from '@/interface/auth'

export default defineComponent({
  name: 'Login',
  components: {
    CopyRight,
    PhoneComponent,
    UserNamePasswordComponent
  },
  setup () {
    const unRef = ref<DefineComponent | null>()
    const phRef = ref<DefineComponent | null>()
    const store = useStore()
    const router = useRouter()

    // 用户认证
    const login = (params: any): void => {
      let credentials: Credentials = {
        type: -1,
        platform: parseInt(process.env.VUE_APP_PLATFORM)
      }

      switch (params.type) {
        case 0:
          credentials = {
            tenant_code: params.tenant,
            username: params.username,
            password: encrypt(params.password),
            key: params.key,
            code: params.captcha,
            type: 1,
            platform: parseInt(process.env.VUE_APP_PLATFORM)
          }
          break
        case 1:
          credentials = {
            tenant_code: params.tenant,
            phone: params.phone,
            code: params.code,
            type: 2,
            platform: parseInt(process.env.VUE_APP_PLATFORM)
          }
          break
      }

      getToken(credentials).then(async res => {
        await store.dispatch('update_userinfo', res.data)
        await router.replace({ name: 'layout' })
      }).catch(() => {
        unRef.value && unRef.value.refreshCaptcha()
        phRef.value && phRef.value.enableLoginButton()
      })
    }
    return {
      login,
      unRef,
      phRef
    }
  }
})
</script>

<style lang="stylus" scoped>
::v-deep(.login-tabs .ant-tabs-bar)
  border-bottom none !important

::v-deep(.login-tabs .ant-tabs-top-bar)
  text-align center !important

.login
  background-image url("../../assets/img/background.svg")
</style>

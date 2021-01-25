<template>
  <div class="login">
    <div class="container">
      <div class="head">
        <div class="title">
          <img src="@/assets/img/logo.svg" alt=""/>
          <span>Ant Design</span>
        </div>
        <span class="subtitle">Ant Design 是西湖区最具影响力的 Web 设计规范</span>
      </div>

      <div class="form">
        <a-tabs>
          <a-tab-pane key="1" tab="账户密码登录">
            <UserNamePasswordComponent @login="login" ref="unRef"/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="手机号登录">
            <PhoneComponent @login="login"/>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="footer">
        <CopyRight/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DefineComponent, defineComponent, ref} from 'vue'
import {useStore} from 'vuex'
import router from '@/router'
import * as types from '@/store/actionTypes'
import UserNamePasswordComponent from "@/components/login/UserNamePasswordComponent.vue"
import PhoneComponent from "@/components/login/PhoneComponent.vue"
import CopyRight from "@/components/copyright/index.vue"
import {Credentials} from '@/interface'
import {getToken} from '@/api/user'

export default defineComponent({
  name: "Login",
  components: {CopyRight, PhoneComponent, UserNamePasswordComponent},
  setup() {

    const unRef = ref<DefineComponent | null>()
    const store = useStore()

    // 用户认证
    const login = (params: any): void => {
      let credentials: Credentials = {
        type: -1
      }

      switch (params.type) {
        case 0:
          credentials = {
            tenant_code: params.tenant,
            username: params.username,
            password: params.password,
            key: params.key,
            code: params.captcha,
            type: 0,
          }
          break
        case 1:
          credentials = {
            tenant_code: params.tenant,
            phone: params.phone,
            code: params.code,
            type: 1,
          }
          break
      }

      getToken(credentials).then(async res => {
        await store.dispatch(types.UPDATE_TOKEN, res.data).then()
        router.replace('/index').then()
      }).catch(() => {
        unRef.value && unRef.value.refreshCaptcha()
      })
    }
    return {
      login,
      unRef
    }
  }
})
</script>

<style scoped lang="stylus">
@import "./index.styl";
</style>
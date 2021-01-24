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
            <UserNamePasswordComponent @login="login"/>
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
import {defineComponent} from 'vue'
import UserNamePasswordComponent from "@/components/login/UserNamePasswordComponent.vue"
import PhoneComponent from "@/components/login/PhoneComponent.vue"
import CopyRight from "@/components/copyright/index.vue"
import {Credentials} from '@/interface'

export default defineComponent({
  name: "Login",
  components: {CopyRight, PhoneComponent, UserNamePasswordComponent},
  setup() {
    const login = (params: any): void => {
      let credentials: Credentials = {
        tenant_code: '',
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

      //todo login处理
    }
    return {
      login
    }
  }
})
</script>

<style scoped lang="stylus">
@import "./index.styl";
</style>
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
            <UserNamePasswordComponent/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="手机号登录">
            <PhoneComponent/>
          </a-tab-pane>
        </a-tabs>
      </div>

      <div class="submit">
        <a-button type="primary" block size="large">登 录</a-button>
      </div>

      <div class="footer">
        <CopyRight/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import UserNamePasswordComponent from "@/components/login/UserNamePasswordComponent.vue";
import PhoneComponent from "@/components/login/PhoneComponent.vue";
import CopyRight from "@/components/copyright/index.vue";

export default defineComponent({
  name: "Login",
  components: {CopyRight, PhoneComponent, UserNamePasswordComponent},
  setup() {

    return {}
  }
})
</script>

<style scoped lang="stylus">
@import "./index.styl";
</style>
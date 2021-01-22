<template>
  <a-form
      :model="form"
      :rules="rules"
  >
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
  </a-form>
</template>

<script lang="ts">
import {defineComponent, reactive} from 'vue'
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue'

export default defineComponent({
  name: "UserNamePasswordComponent",
  components: {UserOutlined, LockOutlined},
  setup() {
    const data: any = reactive({
      form: {
        username: '',
        password: ''
      },
      rules: []
    })

    return {
      ...data
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
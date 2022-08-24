<template>
  <div class="account w-4/5">
    <el-form
        ref="accountRef"
        :model="accountForm"
        :rules="rules"
        label-width="86px"
        :size="formSize"
        label-position="left"
        class="w-full"
        status-icon
        v-loading="loading"
    >
      <el-form-item label="租户编号" prop="tenant_code">
        <el-input v-model.trim="accountForm.tenant_code" placeholder="租户编号" prefix-icon="OfficeBuilding"/>
      </el-form-item>
      <el-form-item label="账 号" prop="account">
        <el-input v-model.trim="accountForm.account" placeholder="账号" prefix-icon="User"/>
      </el-form-item>
      <el-form-item label="密 码" prop="password">
        <el-input v-model.trim="accountForm.password" type="password" show-password placeholder="密码"
                  prefix-icon="Lock"/>
      </el-form-item>

      <el-form-item class="flex flex-row items-center">
        <el-input class="w-1/2" v-model.trim="accountForm.code" placeholder="验证码" @keyup.enter="login(accountRef)"/>
        <el-image class="w-1/3 h-[60px] ml-auto mr-0 cursor-pointer flex flex-col justify-center items-center"
                  :src="captchaImg"
                  @click="getCaptcha">
          <template #error>
            <div class="w-full flex flex-row justify-center items-center bg-gray-300">
              <el-icon class="h-[60px] text-3xl text-gray-400">
                <Picture/>
              </el-icon>
            </div>
          </template>
        </el-image>
      </el-form-item>

      <el-form-item class="w-2/3 mx-auto mt-12" label-width="0">
        <el-button type="primary" @click="login(accountRef)" class="w-full">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue"
import {ElMessage, FormInstance, FormRules} from "element-plus"
import {getCaptcha} from "../../api/auth/captcha";
import {getToken} from "../../api/auth/auth";
import rsa from "../../util/rsa";

const formSize = ref('large')

const accountRef = ref<FormInstance>()
const captchaImg = ref<string>('')
const loading = ref<boolean>(false)

const accountForm = reactive({
  tenant_code: localStorage.getItem('tenant_code') || '',
  account: '',
  password: '',
  key: '',
  code: ''
})

const rules = reactive<FormRules>({
  tenant_code: [
    {required: true, message: '租户编号不能为空', trigger: 'blur'},
  ],
  account: [
    {required: true, message: '账号不能为空', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '密码不能为空', trigger: 'blur'},
  ],
  code: [
    {required: true, message: '验证码不能为空', trigger: 'blur'},
  ],
})

// 验证码
const loadCaptcha = async () => {
  const res = await getCaptcha()
  accountForm.key = res.data.key
  captchaImg.value = res.data.image
}

loadCaptcha()

// 登录
const login = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (!valid) {
      loading.value = false
      return
    }
    loading.value = true
    const res = await getToken({
      ...accountForm, grant_type: 'password',
      password: rsa(accountForm.password)
    })
    if (res.code !== 200) {
      ElMessage({message: res.msg})
      await loadCaptcha()
      loading.value = false
      return
    }

    // todo login...
  })
}

</script>

<style scoped lang="stylus">
@import "account.styl"
</style>
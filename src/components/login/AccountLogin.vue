<template>
  <div class="account w-4/5">
    <el-form
        ref="accountRef"
        v-loading="loading"
        :model="accountForm"
        :rules="rules"
        :size="formSize"
        class="w-full"
        label-position="left"
        label-width="86px"
        status-icon
    >
      <el-form-item label="商户编号" prop="merchantCode">
        <el-input v-model.trim="accountForm.merchantCode" :autofocus="accountForm.merchantCode===''" placeholder="商户编号" prefix-icon="OfficeBuilding"/>
      </el-form-item>
      <el-form-item label="账 号" prop="account">
        <el-input v-model.trim="accountForm.account" :autofocus="accountForm.merchantCode!==''" placeholder="账号" prefix-icon="User"/>
      </el-form-item>
      <el-form-item label="密 码" prop="password">
        <el-input v-model.trim="accountForm.password" placeholder="密码" prefix-icon="Lock" show-password
                  type="password"/>
      </el-form-item>

      <el-form-item class="flex flex-row items-center">
        <el-input v-model.trim="accountForm.code" class="w-1/2" placeholder="验证码" @keyup.enter="login(accountRef)"/>
        <el-image :src="captchaImg"
                  class="w-[120px] h-[60px] ml-auto mr-0 cursor-pointer flex flex-col justify-center items-center"
                  @click="loadCaptcha">
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
        <el-button class="w-full" type="primary" @click="login(accountRef)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue"
import {FormInstance, FormRules} from "element-plus"
import {getCaptcha} from "../../api/auth/captcha"
import {getToken} from "../../api/auth/auth"
import {useLocalStorage} from "@vueuse/core"
import {useUserStore} from "../../store/user"

const emit = defineEmits(['handleLogin'])

const userStore = useUserStore()

const formSize = ref('large')

const accountRef = ref<FormInstance>()
const captchaImg = ref<string>('')
const loading = ref<boolean>(false)

const accountForm = reactive({
  merchantCode: useLocalStorage('user', userStore.getUserInfo).value.merchantCode,
  account: '',
  password: '',
  key: '',
  code: ''
})

const rules = reactive<FormRules>({
  merchantCode: [
    {required: true, message: '商户编号不能为空', trigger: 'blur'},
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
  accountForm.code = ''
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
    getToken({
      ...accountForm, grantType: 'password',
      password: accountForm.password
    }).then(async res => {
      const user = res.data.user
      emit('handleLogin', {
        id: user.id,
        merchantId: user.merchantId,
        account: accountForm.account,
        nickName: user.nickName,
        phone: user.phone,
        merchantCode: accountForm.merchantCode,
        token: res.data.token.tokenValue,
        roles: user.roles || [],
        permissions: user.permissions || []
      })
    }).catch(async () => {
      loading.value = false
      accountForm.code = ''
      await loadCaptcha()
    })
  })
}

</script>

<style lang="stylus" scoped>
@import "account.styl"
</style>
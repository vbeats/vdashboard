<template>
  <div class="profile w-2/3 mx-auto flex flex-col items-center">
    <img src="../../assets/img/avatar.png" alt="" class="w-28 mt-8 mb-12">
    <el-form :model="userInfo" label-width="120px">
      <el-form-item label="昵称">
        <el-input v-model="userInfo.username" disabled/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="userInfo.phone" disabled/>
      </el-form-item>
    </el-form>
    <el-divider/>
    <el-form ref="accountRef" :model="accountInfo" :rules="rules" label-width="120px">
      <el-form-item label="原始密码" prop="password">
        <el-input v-model.trim="accountInfo.password" type="password" show-password placeholder="原始密码"
                  prefix-icon="Lock"/>
      </el-form-item>
      <el-form-item label="新密码" prop="new_password">
        <el-input v-model.trim="accountInfo.new_password" type="password" show-password placeholder="新密码"
                  prefix-icon="Lock"/>
      </el-form-item>
      <el-form-item label="重新输入" prop="re_password">
        <el-input v-model.trim="accountInfo.re_password" type="password" show-password placeholder="重新输入"
                  prefix-icon="Lock"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changAccountInfo(accountRef)">确定</el-button>
        <el-button @click="resetForm(accountRef)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {useUserStore} from "../../store/user"
import {reactive, ref} from "vue"
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {updateAccountInfo} from "../../api/auth/auth";
import encrypt from "../../util/rsa";
import {useRouter} from "vue-router";

const accountRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const userInfo = userStore.getUserInfo

const accountInfo = reactive({
  password: '',
  new_password: '',
  re_password: ''
})

const checkPass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else if (value !== accountInfo.new_password) {
    callback(new Error("两次输入不一致"))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  password: [
    {required: true, message: '原始密码不能为空', trigger: 'blur'},
  ],
  new_password: [
    {required: true, message: '新密码不能为空', trigger: 'blur'},
  ],
  re_password: [
    {validator: checkPass, trigger: 'blur'}
  ]
})

const changAccountInfo = (formEl: FormInstance | undefined) => {
  formEl && formEl.validate(async valid => {
    if (valid) {
      const res = await updateAccountInfo({password: encrypt(accountInfo.password), new_password: encrypt(accountInfo.new_password)})
      if (res.code === 200) {
        ElMessage.success({message: '修改成功', duration: 8000})
        setTimeout(async () => {
          await userStore.logout()
          await router.replace({name: 'login'})
        }, 2000)
      }
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  formEl?.resetFields()
}
</script>

<style scoped lang="stylus">

</style>
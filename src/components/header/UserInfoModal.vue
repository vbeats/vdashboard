<template>
  <a-modal :visible="visible" title="修改信息" @cancel="handleCancel" @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="密码" name="password">
        <a-input v-model:value="formState.password" placeholder="密码" type="password"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="手机号" name="phone">
        <a-input v-model:value="formState.phone" placeholder="手机号" type="phone"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, UnwrapRef } from 'vue'
import { message } from 'ant-design-vue'
import encrypt from '@/util/crypto'
import { updateUserProfile } from '@/api/setting'
import { useStore } from 'vuex'

interface FormState {
  platform:number,
  id:string,
  password: string,
  phone?:string
}

export default defineComponent({
  name: 'UserInfoModal',
  emits: ['cancel', 'handleUser'],
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  setup (props, { emit }) {
    const formRef = ref()
    const store = useStore()

    const formState: UnwrapRef<FormState> = reactive({
      platform: parseInt(process.env.VUE_APP_PLATFORM),
      id: store.getters.getUserInfo.user.id || '',
      password: '',
      phone: store.getters.getUserInfo.user.phone || ''
    })

    const rules = {
      password: [
        {
          required: true,
          message: '密码不能为空',
          trigger: 'blur'
        },
        {
          pattern: '^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$',
          message: '至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符',
          trigger: 'blur'
        }
      ],
      phone: [
        {
          required: false,
          trigger: 'blur'
        },
        {
          pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
          message: '手机号错误',
          trigger: 'blur'
        }
      ]
    }

    const handleOk = () => {
      formRef.value
        .validate()
        .then(async () => {
          const res = await updateUserProfile({ ...formState, password: encrypt(formState.password) })
          if (res.code === 200) {
            // 用户信息重新加载
            message.success('修改成功')
            await store.dispatch('refresh_token')
            setTimeout(() => {
              handleCancel()
            }, 800)
          }
        })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    return {
      formRef,
      formState,
      handleOk,
      handleCancel,
      rules
    }
  }
})
</script>

<style scoped>

</style>

<template>
  <a-modal :visible="visible" :title="action==='add'?'新增用户':'更新用户'" @ok="handleOk" @cancel="handleCancel">
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="username" :wrapperCol="{span:18}" label="用户名" :label-col="{span:4}">
        <a-input v-model:value="formState.username" placeholder="用户名" :disabled="action==='update'"/>
      </a-form-item>
      <a-form-item name="password" :wrapperCol="{span:18}" label="密码" :label-col="{span:4}">
        <a-input v-model:value="formState.password" placeholder="密码" type="password"/>
      </a-form-item>
      <a-form-item name="phone" :wrapperCol="{span:18}" label="手机号" :label-col="{span:4}">
        <a-input v-model:value="formState.phone" placeholder="手机号"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, toRaw, UnwrapRef, watch} from 'vue'
import {UserFormState} from "@/interface/setting/user";
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue'
import {RuleObject} from "ant-design-vue/es/form/interface";

export default defineComponent({
  name: "UserModal",
  emits: ['cancel', 'handleUser'],
  components: [UserOutlined, LockOutlined],
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    action: {
      type: String,
      required: false,
      default: 'add'
    },
    data: {type: Object, required: false}
  },
  setup(props, {emit}) {

    const formRef = ref()

    const formState: UnwrapRef<UserFormState> = reactive({
      username: '', password: ''
    })

    watch(() => props.action, (newVal) => {
      if (newVal === 'update') {
        const item: any = props.data
        formState.id = item.id
        formState.username = item.username
        formState.password = ''
        formState.phone = item.phone || ''
      } else {
        formState.id = 0
        formState.username = ''
        formState.password = ''
        formState.phone = ''
      }
    })

    const checkPassword = async (rule: RuleObject, value: string) => {
      const pattern = "^\\S*(?=\\S{6,})(?=\\S*\\d)(?=\\S*[A-Z])(?=\\S*[a-z])(?=\\S*[!@#$%^&*? ])\\S*$"
      const regex = new RegExp(pattern)
      if ((!formState.id || formState.id === 0) && (
          !value || !regex.test(value))) {
        return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
      } else if (formState.id && formState.id > 0 && value && !regex.test(value)) {
        return Promise.reject('至少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符')
      } else {
        return Promise.resolve()
      }
    }

    const rules = {
      username: [
        {required: true, message: '用户名不能为空', trigger: 'blur'},
        {min: 3, message: '不能少于5个字符', trigger: 'blur'},
      ],
      password: [
        {validator: checkPassword, trigger: 'blur'},
      ],
      phone: [
        {required: false, trigger: 'blur'},
        {
          pattern: '^(?:(?:\\+|00)86)?1(?:(?:3[\\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\\d])|(?:9[189]))\\d{8}$',
          message: '手机号错误',
          trigger: 'blur'
        },
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handleUser', toRaw(formState))
            setTimeout(() => formRef.value.resetFields(), 1000)
          })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    return {
      formRef, formState,
      handleOk, handleCancel, rules,
    }
  }
})
</script>

<style scoped>

</style>
<template>
  <a-modal :visible="visible" :title="action==='add'?'新增用户':'更新用户'" @ok="handleOk" @cancel="handleCancel"
           destroy-on-close>
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
      <a-form-item name="tid" :wrapperCol="{span:18}" label="租户" :label-col="{span:4}">
        <a-select v-model:value="formState.tid" placeholder="选择租户" @select="handleSelectTenant">
          <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="role_id" :wrapperCol="{span:18}" label="角色" :label-col="{span:4}">
        <a-select v-model:value="formState.role_id" placeholder="选择角色">
          <a-select-option v-for="item in roles" :key="item.id" :value="item.id">{{ item.role_name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, Ref, ref, toRaw, UnwrapRef, watch} from 'vue'
import {UserFormState} from "@/interface/setting/user";
import {RuleObject} from "ant-design-vue/es/form/interface";
import {getRoleList} from "@/api/setting";

export default defineComponent({
  name: "UserModal",
  emits: ['cancel', 'handleUser'],
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
    tenants: {
      type: Array
    },
    data: {type: Object, required: false}
  },
  setup(props, {emit}) {

    const formRef = ref()

    const formState: UnwrapRef<UserFormState> = reactive({
      username: '', password: ''
    })

    const roles: Ref<Array<any>> = ref([])

    watch(() => props.action, (newVal) => {
      if (newVal === 'update') {
        const item: any = props.data
        formState.id = item.id
        formState.username = item.username
        formState.password = ''
        formState.phone = item.phone || ''
        formState.role_id = item.role_id
        formState.tid = item.tenant_id
        getRoleList({current: 1, page_size: 10000}, undefined, item.tenant_id).then(res => {
          roles.value = res.data.rows || []
        })
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
      ],
      role_id: [
        {type: 'number', required: true, message: '角色不能为空', trigger: 'blur'},
      ],
      tid: [
        {type: 'number', required: true, message: '租户不能为空', trigger: 'blur'},
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

    const handleSelectTenant = async (id: number) => {
      const res = await getRoleList({current: 1, page_size: 10000}, undefined, id)
      roles.value = res.data.rows || []
    }

    return {
      formRef, formState,
      handleOk, handleCancel, rules, handleSelectTenant, roles
    }
  }
})
</script>

<style scoped>

</style>
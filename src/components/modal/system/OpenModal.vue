<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增配置' : '更新配置'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false" :width="800">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 6}" label-align="left">
      <a-form-item name="tenant_id" label="所属租户">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户" :disabled="mode === 'update'">
          <a-select-option v-for="item in props.tenants" :key="item.id" :value="item.id">{{ item.name }} </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="appid" label="appid id">
        <a-input v-model:value.trim="formState.appid" placeholder="appid" />
      </a-form-item>
      <a-form-item name="secret" label="secret">
        <a-input v-model:value.trim="formState.secret" placeholder="secret" />
      </a-form-item>
      <a-form-item name="type" label="类型">
        <a-radio-group v-model:value="formState.type" name="type">
          <a-radio :value="0">微信公众号</a-radio>
          <a-radio :value="1">微信小程序</a-radio>
          <a-radio :value="2">其它</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="remark" label="备注">
        <a-input v-model:value.trim="formState.remark" placeholder="备注" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {deepCopy} from '@/util/util'
import {useStore} from 'vuex'

interface FormState {
  id?: string
  tenant_id: string
  appid: string
  secret: string
  type: number
  remark?: string
}

const user = useStore().getters.getUserInfo
const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const defaultConfig = {
  tenant_id: user.tenant_id,
  appid: '',
  secret: '',
  type: 0,
}
const formState: UnwrapRef<FormState> = reactive({...defaultConfig})

const grantType = ref([])

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  item: {
    type: Object,
    required: false,
  },
  tenants: {
    type: Array,
    required: true,
  },
})

const rules = {
  tenant_id: [{required: true, message: '不能为空', trigger: 'blur'}],
  appid: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 32}],
  secret: [{required: true, message: '不能为空', trigger: 'blur'}, {max: 64}],
  type: [{required: true, type: 'number', message: '不能为空', trigger: 'blur'}],
  remark: [{required: false}, {max: 32, message: '最多32个字符'}],
}
const handleOk = () => {
  formRef.value &&
    formRef.value.validate().then(() => {
      emit('handleOk', toRaw(formState))
    })
}

const handleCancel = () => {
  formRef.value.resetFields()
  emit('handleCancel')
}

watchEffect(() => {
  const item = props.item
  if (props.mode === 'update' && item) {
    deepCopy(item, formState)
  } else {
    deepCopy(defaultConfig, formState)
  }
})
</script>

<style scoped lang="stylus"></style>

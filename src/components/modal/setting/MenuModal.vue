<template>
  <a-modal :title="action==='add'?'新增菜单':'更新菜单'" :visible="visible" :width="800" destroy-on-close
           @cancel="handleCancel"
           @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules" label-align="left"
    >
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="菜单名" name="title">
        <a-input v-model:value="formState.title" placeholder="菜单名"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="key" name="key">
        <a-input v-model:value="formState.key" placeholder="唯一标识"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="path" name="path">
        <a-input v-model:value="formState.path" placeholder="路由路径"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="icon图标" name="icon">
        <a-input v-model:value="formState.icon" placeholder="vue ant design icon"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="顺序" name="sort">
        <a-input-number v-model:value="formState.sort" placeholder="顺序"/>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="父级菜单" name="p_id">
        <a-select v-model:value="formState.p_id" placeholder="父级菜单">
          <a-select-option :value="0">无</a-select-option>
          <a-select-option v-for="item in menus" :key="item.id" :value="item.id">{{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="是否展示" name="show">
        <a-radio-group v-model:value="formState.show">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="默认选中" name="default_select">
        <a-radio-group v-model:value="formState.default_select">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="{span:4}" :wrapperCol="{span:18}" label="默认展开" name="default_open">
        <a-radio-group v-model:value="formState.default_open">
          <a-radio :value="false">否</a-radio>
          <a-radio :value="true">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect } from 'vue'

interface FormState {
  id?: number,
  title?: string,
  key?: string,
  path?: string,
  icon?: string,
  sort?: number,
  p_id?: number,
  show?: boolean,
  default_select?: boolean,
  default_open?: boolean
}

const props = defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  action: {
    type: String,
    required: false,
    default: 'add'
  },
  menus: {
    type: Array,
    required: true
  },
  data: {
    type: Object,
    required: false
  }
})

const formState: UnwrapRef<FormState> = reactive({
  show: true,
  default_select: false,
  default_open: true
})

const formRef = ref()
const emit = defineEmits(['cancel', 'handleAddOrUpdateMenu'])

const handleCancel = () => {
  emit('cancel')
}

const handleOk = () => {
  formRef.value && formRef.value
    .validate()
    .then(() => {
      emit('handleAddOrUpdateMenu', toRaw(formState))
    })
}

watchEffect(() => {
  const d = props.data
  if (d?.id > 0) {
    formState.id = d?.id
    formState.title = d?.title
    formState.key = d?.key
    formState.path = d?.path
    formState.icon = d?.icon
    formState.sort = d?.sort
    formState.p_id = d?.p_id
    formState.show = d?.show
    formState.default_select = d?.default_select
    formState.default_open = d?.default_open
  } else {
    formState.id = undefined
    formState.title = undefined
    formState.key = undefined
    formState.path = undefined
    formState.icon = undefined
    formState.sort = undefined
    formState.p_id = 0
    formState.show = true
    formState.default_select = false
    formState.default_open = true
  }
})

const rules = {
  title: [
    {
      required: true,
      message: '菜单名不能为空',
      trigger: 'blur'
    }
  ],
  key: [
    {
      required: true,
      message: 'key不能为空',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: 'path不能为空',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      type: 'number',
      required: true,
      message: '顺序不能为空',
      trigger: 'blur'
    }
  ],
  show: [
    {
      type: 'boolean',
      required: true,
      message: '必选',
      trigger: 'blur'
    }
  ],
  default_select: [
    {
      type: 'boolean',
      required: true,
      message: '必选',
      trigger: 'blur'
    }
  ],
  default_open: [
    {
      type: 'boolean',
      required: true,
      message: '必选',
      trigger: 'blur'
    }
  ]
}

</script>

<style scoped>

</style>

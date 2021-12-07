<template>
  <a-modal :visible="visible" :title="mode === 'add' ? '新增菜单' : '更新菜单'" @ok="handleOk" @cancel="handleCancel" :destroyOnClose="true" :maskClosable="false">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="{span: 4}" label-align="left">
      <a-form-item name="title" label="名称">
        <a-input v-model:value.trim="formState.title" placeholder="菜单/按钮名称" />
      </a-form-item>
      <a-form-item label="上级菜单" name="pid">
        <a-tree-select
          v-model:value="formState.ptitle"
          placeholder="上级菜单"
          show-search
          :dropdown-style="{maxHeight: '500px', overflow: 'auto'}"
          allow-clear
          :tree-data="props.menuList"
          :field-names="{children: 'children', label: 'title', key: 'id'}"
          tree-node-filter-prop="title"
          @change="handleSelectMenu"
          :disabled="mode === 'update'"
        />
      </a-form-item>
      <a-form-item name="key" label="key" v-if="formState.type === 0">
        <a-input v-model:value.trim="formState.key" placeholder="唯一标识" />
      </a-form-item>
      <a-form-item name="path" label="前端路由" v-if="formState.type === 0">
        <a-input v-model:value.trim="formState.path" placeholder="前端路由" />
      </a-form-item>
      <a-form-item name="icon" label="Icon" v-if="formState.type === 0">
        <a-input v-model:value.trim="formState.icon" placeholder="ant design vue icon" />
      </a-form-item>
      <a-form-item name="action" label="权限字段">
        <a-input v-model:value.trim="formState.action" placeholder="例如: user:add" />
      </a-form-item>
      <a-form-item name="sort" label="顺序">
        <a-input-number v-model:value="formState.sort" placeholder="顺序" />
      </a-form-item>
      <a-form-item name="type" label="类型">
        <a-radio-group v-model:value="formState.type">
          <a-radio :value="0">菜单</a-radio>
          <a-radio :value="1">按钮</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="show" label="是否展示" v-if="formState.type === 0">
        <a-radio-group v-model:value="formState.show">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="default_select" label="默认选中" v-if="formState.type === 0">
        <a-radio-group v-model:value="formState.default_select">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="default_open" label="默认展开" v-if="formState.type === 0">
        <a-radio-group v-model:value="formState.default_open">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import {defineEmits, defineProps, reactive, ref, toRaw, UnwrapRef, watchEffect} from 'vue'
import {RuleObject} from 'ant-design-vue/es/form'

interface FormState {
  id?: string
  title: string
  pid?: string
  ptitle?: string
  key?: string
  path?: string
  icon?: string
  action?: string
  type: number
  sort: number
  show?: boolean
  default_select?: boolean
  default_open?: boolean
}

const emit = defineEmits(['handleOk', 'handleCancel'])
const formRef = ref()
const formState: UnwrapRef<FormState> = reactive({
  title: '',
  type: 0,
  sort: 0,
  show: true,
  default_select: false,
  default_open: false,
})

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
  menuList: {
    type: Array,
    required: true,
  },
})

const checkKey = async (rule: RuleObject, value: string): Promise<any> => {
  if (formState.type === 0 && (!value || value === '')) {
    return Promise.reject('key不能为空')
  } else {
    return Promise.resolve()
  }
}

const checkPath = async (rule: RuleObject, value: string): Promise<any> => {
  if (formState.type === 0 && (!value || value === '')) {
    return Promise.reject('路由不能为空')
  } else {
    return Promise.resolve()
  }
}

const rules = {
  title: [{required: true, message: '名称不能为空', trigger: 'blur'}],
  key: [{validator: checkKey, trigger: 'blur'}],
  path: [{validator: checkPath, trigger: 'blur'}],
  sort: [{type: 'number', required: true, message: '顺序不能为空', trigger: 'blur'}],
}

const handleSelectMenu = (value: string) => {
  formState.pid = value
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
    formState.id = item.id
    formState.title = item.title
    formState.pid = item.pid
    formState.ptitle = item.ptitle
    formState.key = item.key
    formState.path = item.path
    formState.icon = item.icon
    formState.action = item.action
    formState.type = item.type
    formState.sort = item.sort
    formState.show = item.show
    formState.default_select = item.default_select
    formState.default_open = item.default_open
  } else {
    formState.id = undefined
    formState.title = ''
    formState.pid = undefined
    formState.ptitle = undefined
    formState.key = undefined
    formState.path = undefined
    formState.icon = undefined
    formState.action = undefined
    formState.type = 0
    formState.sort = 0
    formState.show = true
    formState.default_select = false
    formState.default_open = false
  }
})
</script>

<style scoped lang="stylus"></style>

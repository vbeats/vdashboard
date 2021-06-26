<template>
  <a-modal :visible="visible" :title="action==='add'?'新增菜单':'更新菜单'" @ok="handleOk" @cancel="handleCancel"
           :width="800"
           destroy-on-close>
    <a-form
        ref="formRef"
        :model="formState"
        label-align="left" :rules="rules"
    >
      <a-form-item name="title" :wrapperCol="{span:18}" label="菜单名" :label-col="{span:4}">
        <a-input v-model:value="formState.title" placeholder="菜单名"/>
      </a-form-item>
      <a-form-item name="key" :wrapperCol="{span:18}" label="key" :label-col="{span:4}">
        <a-input v-model:value="formState.key" placeholder="唯一标识"/>
      </a-form-item>
      <a-form-item name="path" :wrapperCol="{span:18}" label="path" :label-col="{span:4}">
        <a-input v-model:value="formState.path" placeholder="路由路径"/>
      </a-form-item>
      <a-form-item name="icon" :wrapperCol="{span:18}" label="icon图标" :label-col="{span:4}">
        <a-input v-model:value="formState.icon" placeholder="vue ant design icon"/>
      </a-form-item>
      <a-form-item name="sort" :wrapperCol="{span:18}" label="顺序" :label-col="{span:4}">
        <a-input v-model:value="formState.sort" placeholder="顺序" type="number"/>
      </a-form-item>
      <a-form-item name="tenant_id" :wrapperCol="{span:18}" label="租户" :label-col="{span:4}">
        <a-select v-model:value="formState.tenant_id" placeholder="选择租户" @select="handleSelectTenant"
                  :disabled="action==='update'">
          <a-select-option v-for="item in tenants" :key="item.id" :value="item.id">{{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="pid" :wrapperCol="{span:18}" label="父级菜单" :label-col="{span:4}">
        <a-select v-model:value="formState.pid" placeholder="父级菜单" :disabled="action==='update'">
          <a-select-option v-for="item in menus" :key="item.id" :value="item.id">{{ item.title }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item name="actions" :wrapperCol="{span:18}" label="权限字段" :label-col="{span:4}">
        <a-input v-model:value="formState.actions" placeholder="[json格式, 压缩]"/>
      </a-form-item>
      <a-form-item name="default_select" :wrapperCol="{span:18}" label="默认选中" :label-col="{span:4}">
        <a-radio-group v-model:value="formState.default_select">
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item name="default_open" :wrapperCol="{span:18}" label="默认展开" :label-col="{span:4}">
        <a-radio-group v-model:value="formState.default_open">
          <a-radio :value="0">否</a-radio>
          <a-radio :value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, Ref, ref, toRaw, UnwrapRef, watch} from 'vue'
import {getParentMenu} from "@/api/setting";

interface FormState {
  id?: number,
  title?: string,
  key?: string,
  path?: string,
  icon?: string,
  sort?: number,
  tenant_id?: number,
  pid?: number,
  actions?: string,
  default_select?: number,
  default_open?: number
}

export default defineComponent({
  name: "MenuModal",
  emits: ['cancel', 'handleMenu'],
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

    const formState: UnwrapRef<FormState> = reactive({default_select: 0, default_open: 0, sort: 0})

    const menus: Ref<Array<any>> = ref([])

    watch(() => props.action, (newVal) => {
      if (newVal === 'update') {
        const item: any = props.data
        formState.id = item.id
        formState.title = item.title
        formState.key = item.key
        formState.path = item.path
        formState.icon = item.icon
        formState.sort = item.sort
        formState.tenant_id = item.tenant_id
        formState.pid = item.pid
        formState.actions = item.actions
        formState.default_open = item.default_open
        formState.default_select = item.default_select
        menus.value = [{id: item.pid, title: item.ptitle}]
      } else {
        formState.id = undefined
        formState.title = ''
        formState.key = ''
        formState.path = ''
        formState.icon = ''
        formState.sort = 0
        formState.tenant_id = undefined
        formState.pid = undefined
        formState.actions = ''
        formState.default_open = 0
        formState.default_select = 0
      }
    })

    const rules = {
      title: [
        {required: true, message: '菜单名不能为空', trigger: 'blur'},
      ],
      key: [
        {required: true, message: 'key不能为空', trigger: 'blur'},
      ],
      path: [
        {required: true, message: 'path不能为空', trigger: 'blur'},
      ],
      sort: [
        {type: 'number', required: true, message: '顺序不能为空', trigger: 'blur'},
      ],
      tenant_id: [
        {type: 'number', required: true, message: '租户不能为空', trigger: 'blur'},
      ],
      actions: [
        {required: true, message: '权限不能为空', trigger: 'blur'},
      ],
      default_select: [
        {type: 'number', required: true, message: '不能为空', trigger: 'blur'},
      ],
      default_open: [
        {type: 'number', required: true, message: '不能为空', trigger: 'blur'},
      ]
    }

    const handleOk = () => {
      formRef.value
          .validate()
          .then(() => {
            emit('handleMenu', toRaw(formState))
            setTimeout(() => formRef.value.resetFields(), 1000)
          })
    }

    const handleCancel = () => {
      formRef.value && formRef.value.resetFields()
      emit('cancel')
    }

    const handleSelectTenant = async (id: number) => {
      const res = await getParentMenu({id})
      menus.value = res.data || []
    }

    return {
      formRef, formState, menus,
      handleOk, handleCancel, rules, handleSelectTenant
    }
  }
})
</script>

<style scoped>

</style>
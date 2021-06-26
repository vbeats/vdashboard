<template>
  <!--添加-->
  <a-button type="primary" class="mt-4" v-if="menuActions.add"
            @click="showAddModal">
    <template #icon>
      <PlusCircleOutlined/>
    </template>
    新增菜单
  </a-button>
  <!--table-->
  <a-table bordered
           :columns="columns"
           :row-key="record => record.id"
           :data-source="datasource"
           :pagination="{total,current,pageSize}"
           :loading="loading"
           @change="handleTableChange" :scroll="{x:1000}" class="mt-8"
  >
    <template #actions="{text}">
      <a-tooltip placement="top" :title="text">
        <span>{{ text && text.length > 10 ? text.substring(0, 8) + "...." : text }}</span>
      </a-tooltip>
    </template>
    <template #select="{text}">
      <a-tag color="#87d068" v-if="text===1">是</a-tag>
      <a-tag color="#f50" v-else>否</a-tag>
    </template>
    <template #open="{text}">
      <a-tag color="#87d068" v-if="text===1">是</a-tag>
      <a-tag color="#f50" v-else>否</a-tag>
    </template>
    <template #operation="{ record }" v-if="menuActions.update||menuActions.delete">
      <a-space>
        <a-button type="primary" v-if="menuActions.update" @click="showUpdateModal(record)">更新
        </a-button>
        <a-button type="danger" v-if="menuActions.delete" @click="handleDeleteMenu(record)">删除
        </a-button>
      </a-space>
    </template>
  </a-table>

  <!-- Modal -->
  <menu-modal :visible="menuModal" :action="modalType" :data="item" :tenants="tenants" @cancel="handleCancel"
              @handleMenu="handleMenu"/>

</template>

<script lang="ts">
import {defineComponent, reactive, Ref, ref, toRefs} from 'vue'
import {useRoute} from 'vue-router'
import {Permission} from "@/interface/user/permission";
import {checkPerms, getPerms} from "@/utils/permsUtil";
import {EditOutlined, PlusCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import {addMenu, delMenu, getMenuList, getTenantList, updateMenu} from '@/api/setting'
import UserModal from "@/components/modal/UserModal.vue";
import {Actions} from "@/interface/user/actions";
import {TableState} from 'ant-design-vue/es/table/interface'
import {message} from "ant-design-vue";
import TenantModal from "@/components/modal/TenantModal.vue";
import MenuModal from "@/components/modal/MenuModal.vue";

type Pagination = TableState['pagination']

interface DataItem {
  id: number;
  code: string;
  name: string;
  create_time: string
}

export default defineComponent({
  name: "Menu",
  components: {MenuModal, TenantModal, UserModal, PlusCircleOutlined, EditOutlined, UserOutlined},
  setup() {
    const route = useRoute()
    const perms: Array<Permission> = getPerms(route.meta)

    // 权限
    const menuActions: Actions = checkPerms('menu', perms)

    const data = reactive({
      loading: true,
      total: 0,
      current: 1,
      pageSize: 10,
      menuModal: false,
      modalType: 'add', // add|update
      item: {}
    })

    const datasource: Ref<DataItem[]> = ref([])
    const tenants: Ref<Array<any>> = ref([])

    const menuList = () => {
      getMenuList({current: data.current, page_size: data.pageSize}).then(res => {
        data.loading = false
        datasource.value = res.data.rows
        data.total = res.data.total
      })
    }

    // 获取菜单列表
    menuActions.list && menuList()

    const columns = [
      {
        title: '租户',
        dataIndex: 'tenant_name',
      },
      {
        title: '菜单',
        dataIndex: 'title',
      },
      {
        title: '顺序',
        dataIndex: 'sort',
      },
      {
        title: 'key',
        dataIndex: 'key',
      },
      {
        title: 'path',
        dataIndex: 'path',
      },
      {
        title: 'icon',
        dataIndex: 'icon',
      },
      {
        title: '父级',
        dataIndex: 'ptitle',
      },
      {
        title: '权限',
        dataIndex: 'actions',
        slots: {customRender: 'actions'},
      },
      {
        title: '默认选中',
        dataIndex: 'default_select',
        slots: {customRender: 'select'},
      },
      {
        title: '默认展开',
        dataIndex: 'default_open',
        slots: {customRender: 'open'},
      },
      {
        title: '操作',
        width: '300px',
        align: 'center',
        slots: {customRender: 'operation'},
      }
    ];

    const handleTableChange = (page: Pagination) => {
      data.current = page?.current || 1
      data.pageSize = page?.pageSize || 10
      menuList()
    }

    const showUpdateModal = async (record: any) => {
      data.item = record
      tenants.value = [{id: record.tenant_id, name: record.tenant_name}]
      data.modalType = 'update'
      data.menuModal = true
    }

    // 新增or update菜单
    const handleMenu = (item: any) => {
      if (item.id && item.id > 0) {
        // update
        updateMenu(item).then((res) => {
          message.success('更新成功')
          handleRes(res)
        })
      } else {
        // add
        addMenu(item).then((res) => {
          message.success('添加成功')
          handleRes(res)
        })
      }
    }

    const handleRes = (res: any) => {
      if (res.code !== 200) return

      setTimeout(() => {
        handleCancel()
        menuList()
      }, 1200)
    }

    const handleCancel = () => {
      data.item = {}
      data.menuModal = false
      data.modalType = 'add'
    }

    const showAddModal = async () => {
      const rs = await getTenantList({current: 1, page_size: 10000})
      tenants.value = rs.data.rows || []
      data.menuModal = true
    }

    const handleDeleteMenu = async (record: any) => {
      const res = await delMenu({id: record.id})
      if (res.code === 200) {
        message.success('删除成功')
        setTimeout(() => menuList(), 380)
      }
    }

    return {
      datasource,
      perms,
      menuActions,
      ...toRefs(data),
      columns,
      handleCancel,
      handleTableChange,
      showUpdateModal,
      handleMenu,
      showAddModal,
      handleDeleteMenu, tenants
    }
  }
})
</script>

<style scoped lang="stylus">

</style>
<template>
  <avue-crud :data="clients" v-model:search="search" :option="option" v-model:page="page"
             @refresh-change="listClients" @search-change="listClients"
             @size-change="listClients" @current-change="listClients"
             @row-save="addClient" @row-update="updateClient" @row-del="delClient"
  >

  </avue-crud>
</template>

<script setup lang="ts">
import {ref} from "vue"
import {add, del, list, update} from "../../../api/client"
import {useRoute} from "vue-router"
import {useTitle} from "@vueuse/core"
import checkPerms from "../../../util/checkPerms"
import {ElMessage} from "element-plus";

const route = useRoute()

const title = useTitle()

title.value += ' | ' + route.meta.title

const clients = ref([])
const search = ref({
  client_id: ''
})

const page = ref({
  total: 0,
  currentPage: 1,
  pageSize: 30
})

const listClients = async (param?: any, done?: any) => {
  const res = await list({current: page.value.currentPage, page_size: page.value.pageSize, client_id: search.value.client_id})
  clients.value = res.data.rows || []
  page.value.total = res.data.total || 0
  done && done()
}


const addClient = async (row: any, done: any, loading: any) => {
  row.grant_types = row.grant_types.join(',')
  await add(row)
  ElMessage.success({message: '添加成功'})
  setTimeout(async () => {
    done()
    await listClients()
  }, 800)
}

const updateClient = async (row: any, index: any, done: any, loading: any) => {
  await update(row)
  ElMessage.success({message: '更新成功'})
  setTimeout(async () => {
    done()
    await listClients()
  }, 800)
}

const delClient = async (row: any, index: any) => {
  await del(row)
  ElMessage.success({message: '删除成功'})
  setTimeout(async () => {
    await listClients()
  }, 800)
}

const option = ref({
  addBtn: checkPerms(route, 'add'),
  editBtn: checkPerms(route, 'edit'),
  delBtn: checkPerms(route, 'del'),
  border: true,
  searchShowBtn: false,
  dialogWidth: '80%',
  column: [
    {
      label: '客户端ID',
      prop: 'client_id',
      search: true,
      width: 120,
      order: 10
    },
    {
      label: '客户端Secret',
      prop: 'client_secret',
      overHidden: true,
      width: 120,
      labelWidth: 150,
      order: 9
    },
    {
      label: '授权类型',
      prop: 'grant_types',
      type: 'checkbox',
      dicData: [
        {
          label: '微信小程序',
          value: 'wx_app'
        },
        {
          label: '微信公众号',
          value: 'wx_mp'
        },
        {
          label: '密码登陆',
          value: 'password'
        },
        {
          label: '短信登陆',
          value: 'sms'
        },
        {
          label: '刷新token',
          value: 'refresh_token'
        }
      ],
      value: ['wx_app', 'wx_mp', 'password', 'sms', 'refresh_token'],
      width: 150,
      overHidden: true,
      order: 8
    },
    {
      label: 'access_token有效时间s',
      prop: 'access_token_expire',
      labelWidth: 180,
      width: 180,
      value: 7200,
      align: 'center',
      type: 'number',
      controls: false,
    },
    {
      label: 'refresh_token有效时间d',
      prop: 'refresh_token_expire',
      labelWidth: 180,
      width: 180,
      align: 'center',
      value: 30,
      type: 'number',
      controls: false,
    },
    {
      label: '公钥',
      prop: 'public_key',
      overHidden: true,
      width: 120,
      type: 'textarea'
    },
    {
      label: '私钥',
      prop: 'private_key',
      overHidden: true,
      width: 120,
      type: 'textarea'
    },
    {
      label: '备注',
      prop: 'remark',
      overHidden: true,
      width: 120,
      order: 7
    },
    {
      label: '创建时间',
      prop: 'create_time',
      width: 160,
      display: false
    },
    {
      label: '更新时间',
      prop: 'update_time',
      width: 160,
      hide: true,
      display: false
    }
  ]
})
</script>

<style scoped lang="stylus">

</style>
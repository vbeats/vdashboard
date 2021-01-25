<template>
  <router-view/>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useStore} from 'vuex'
import router from '@/router'
import * as types from '@/store/actionTypes'
import storage from '@/utils/storage'
import {Token} from '@/interface'
import {getToken} from '@/api/user'

export default defineComponent({
  name: "Base",
  setup() {

    const store = useStore()

    // 校验token
    const checkToken = async () => {
      console.log('check token......', new Date())
      setTimeout(checkToken, 5 * 60 * 1000)

      // user access_token refresh_token都存在的  校验有效时间  否则logout
      const user: Token = storage.get('user')
      const access_token: string = storage.get('access_token')
      const refresh_token: string = storage.get('refresh_token')
      const access_token_expire: number = storage.getExpiration('access_token') || -1
      const refresh_token_expire: number = storage.getExpiration('refresh_token') || -1

      if (!user || !access_token || !refresh_token || refresh_token_expire <= 0) {
        await store.dispatch(types.LOGOUT).then()
        router.replace('/login').then()
        return
      }

      // access_token如果到期了 刷新; 未到期, 直接用
      if (access_token_expire - new Date().getTime() > 300) { // 剩余时间大于300s
        return
      }

      // 获取新的token
      getToken({type: 2, refresh_token}).then(async res => {
        console.log('token刷新了......', res)
        await store.dispatch(types.UPDATE_TOKEN, res.data).then()
      })

    }

    checkToken()

    return {}
  }
})
</script>

<style lang="stylus" scoped>
</style>
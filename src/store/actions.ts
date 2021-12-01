import {ActionContext, ActionTree} from 'vuex'
import {UserInfo} from '@/store/interface/UserInfo'

const actions: ActionTree<any, any> = {
  load_userinfo: (context: ActionContext<any, any>): void => context.commit('load_userinfo'),
  update_userinfo: (context: ActionContext<any, any>, info: UserInfo): void => context.commit('update_userinfo', info),
  logout: (context: ActionContext<any, any>): void => context.commit('logout'),
  load_language: (context: ActionContext<any, any>, lang: string): void => context.commit('load_language', lang),
}

export default actions

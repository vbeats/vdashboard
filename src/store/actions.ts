import { ActionContext, ActionTree } from 'vuex'

const actions: ActionTree<any, any> = {
  logout: (context: ActionContext<any, any>): any => context.commit('logout'),
  refresh_token: (context:ActionContext<any, any>):void => context.commit('refresh_token'),
  update_userinfo: (context: ActionContext<any, any>, userInfo: any): any => context.commit('update_userinfo', userInfo),
  load_userinfo: (context: ActionContext<any, any>): any => context.commit('load_userinfo'),
  load_language: (context: ActionContext<any, any>, lang: string): any => context.commit('load_language', lang)
}

export default actions

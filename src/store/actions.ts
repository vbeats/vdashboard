import {ActionContext, ActionTree} from 'vuex'
import * as types from './actionTypes'
import {UserInfo} from "@/interface/user"

const actions: ActionTree<any, any> = {
    [types.LOGOUT]: (context: ActionContext<any, any>): any => context.commit(types.LOGOUT),
    [types.UPDATE_USER_INFO]: (context: ActionContext<any, any>, userInfo: UserInfo): any => context.commit(types.UPDATE_USER_INFO, userInfo),
    [types.LOAD_USER_INFO]: (context: ActionContext<any, any>): any => context.commit(types.LOAD_USER_INFO),
    [types.LOAD_LANGUAGE]: (context: ActionContext<any, any>, lang: string): any => context.commit(types.LOAD_LANGUAGE, lang)
}

export default actions

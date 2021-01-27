import {ActionContext, ActionTree} from 'vuex'
import * as types from './actionTypes'
import {Token} from "@/interface"

const actions: ActionTree<any, any> = {
    [types.LOGOUT]: (context: ActionContext<any, any>): any => context.commit(types.LOGOUT),
    [types.UPDATE_TOKEN]: (context: ActionContext<any, any>, token: Token): any => context.commit(types.UPDATE_TOKEN, token),
    [types.LOAD_USER_INFO]: (context: ActionContext<any, any>): any => context.commit(types.LOAD_USER_INFO),
    [types.LOAD_LANGUAGE]: (context: ActionContext<any, any>, lang: string): any => context.commit(types.LOAD_LANGUAGE, lang)
}

export default actions

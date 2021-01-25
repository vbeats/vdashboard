import {ActionContext, ActionTree} from 'vuex'
import * as types from './actionTypes'
import {Token} from "@/interface"

const actions: ActionTree<any, any> = {
    [types.LOGOUT]: (context: ActionContext<any, any>): any => context.commit(types.LOGOUT),
    [types.UPDATE_TOKEN]: (context: ActionContext<any, any>, token: Token): any => context.commit(types.UPDATE_TOKEN, token)
}

export default actions

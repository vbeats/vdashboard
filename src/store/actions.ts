import {ActionContext, ActionTree} from 'vuex'

const actions: ActionTree<any, any> = {
    toLogin: (context: ActionContext<any, any>): any => context.commit('toLogin'),
}

export default actions

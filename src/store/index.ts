import {createStore} from 'vuex'
import actions from "./actions"
import user from './modules/user'
import app from './modules/app'
import getters from './getters'
import {State} from "@/store/interface"

export default createStore({
    state: <State>{},
    mutations: {},
    actions,
    modules: {
        user,
        app
    },
    getters
})

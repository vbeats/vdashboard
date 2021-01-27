import {LOAD_LANGUAGE} from '../actionTypes'
import {SLanguage} from '../interface'

const state = <SLanguage>{
    lang: 'zh-CN'
}

const app: any = {
    [LOAD_LANGUAGE]: (state: SLanguage, lang: string) => {
        state.lang = lang
    }
}

export default {
    state,
    mutations: app
}
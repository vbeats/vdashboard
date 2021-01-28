import {LOAD_LANGUAGE} from '../actionTypes'
import {SLanguage} from '../interface'
import {loadLanguage} from '@/locale'
import storage from '@/utils/storage'

const state = <SLanguage>{
    lang: 'zh-CN'
}

const app: any = {
    [LOAD_LANGUAGE]: (state: SLanguage, lang: string) => {
        state.lang = lang
        storage.set('lang', lang)
        loadLanguage(lang)
    }
}

export default {
    state,
    mutations: app
}
import store from './store'
import storage from './utils/storage'
import {LOAD_LANGUAGE, LOAD_USER_INFO} from './store/actionTypes'

// localStorage user token加载到store中
const loadUserInfo = () => {
    store.dispatch(LOAD_USER_INFO).then()
}

// 默认语言
const loadLanguage = () => {
    store.dispatch(LOAD_LANGUAGE, storage.get('lang') || 'zh-CN').then()
}

export default (): void => {
    loadUserInfo()
    loadLanguage()
}
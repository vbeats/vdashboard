import store from './store'
import storage from './utils/storage'
import {LOAD_LANGUAGE, LOAD_USER_INFO} from './store/actionTypes'

// localStorage login token加载到store中
const loadUserInfo = () => {
    store.dispatch(LOAD_USER_INFO).then()
}

// 默认语言
const loadLanguage = () => {
    store.dispatch(LOAD_LANGUAGE, storage.get('lang') || (navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US')).then()
}

export default (): void => {
    loadUserInfo()
    loadLanguage()
}
import store from './store'
import storage from './utils/storage'
import {LOAD_LANGUAGE, LOAD_USER_INFO} from './store/actionTypes'

// localStorage user token加载到store中
const loadUserInfo = () => {
    store.dispatch(LOAD_USER_INFO).then()
}

// 默认语言
const loadLanguage = () => {
    const sLang = storage.get('lang')
    const nLang = navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US'
    store.dispatch(LOAD_LANGUAGE, sLang || nLang).then()
}

export default (): void => {
    loadUserInfo()
    loadLanguage()
}
import store from './store'

// localStorage login token加载到store中
const loadUserInfo = () => {
  store.dispatch('load_userinfo').then()
}

// 默认语言
const loadLanguage = () => {
  store.dispatch('load_language', localStorage.getItem('lang') || (navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US')).then()
}

export default (): void => {
  loadUserInfo()
  loadLanguage()
}

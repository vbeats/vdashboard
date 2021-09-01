import { loadLanguage } from '@/locale'

const state = {
  lang: 'zh-CN'
}

const app: any = {
  load_language: (state: any, lang: string) => {
    state.lang = lang
    localStorage.setItem('lang', lang)
    loadLanguage(lang)
  }
}

export default {
  state,
  mutations: app
}

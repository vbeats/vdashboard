import {createI18n} from 'vue-i18n'
import zhCNLang from './lang/zh-CN'
import enUSLang from './lang/en-US'
import _ from 'lodash'

const messages = {
  'zh-CN': {
    ...zhCNLang,
  },
  'en-US': {
    ...enUSLang,
  },
}

const lang = 'zh-CN'

const i18n = createI18n({
  locale: lang,
  fallbackLocale: lang,
  legacy: false,
  messages,
})

export function loadLanguage(lang = 'zh-CN'): void {
  const locales = _.keys(messages)
  for (const locale of locales) {
    if (lang === locale) {
      setLanguage(locale)
      return
    }
  }
  setLanguage(lang)
}

const setLanguage = (lang: string) => {
  // i18n.global.locale = lang
  const html: HTMLElement | null = document.querySelector('html')
  html && html.setAttribute('lang', lang)
}

export default i18n

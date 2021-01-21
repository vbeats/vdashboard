const state = {
    lang: 'zh-CN'
}

const app: any = {
    setLang: (state: any, lang: string) => {
        state.lang = lang
    }
}

export default {
    state,
    mutations: app
}
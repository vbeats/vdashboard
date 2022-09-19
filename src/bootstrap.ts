import {useUserStore} from "./store/user"
import {useMenuStore} from "./store/menu"
import initRoutes from "./router/initRoutes"
import {App} from "vue"

// 初始化storage数据
const initData = () => {
    const userStore = useUserStore()
    userStore.loadUserInfo()

    // 菜单 & 路由
    const menuStore = useMenuStore()
    menuStore.loadMenu()
    initRoutes()
}

export default {
    install: (app: App, option: any) => {
        initData()
    }
}

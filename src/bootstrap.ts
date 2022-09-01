import {useUserStore} from "./store/user"
import {useMenuStore} from "./store/menu";
import initRoutes from "./router/initRoutes";

// 初始化storage数据
const initData = async () => {
    const userStore = useUserStore()
    await userStore.loadUserInfo()

    // 菜单 & 路由
    const menuStore = useMenuStore()
    await menuStore.loadMenu()
    await initRoutes()
}

export default async () => {
    await initData()
}

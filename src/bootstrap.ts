// 初始化storage数据
import {useUserStore} from "./store/user";

const initData = async () => {
    const userStore = useUserStore()

    await userStore.loadUserInfo()
}

export default async () => {
    await initData()
};
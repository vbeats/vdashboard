import _ from 'lodash'
import {useUserStore} from "../store/user";

export default (route: any, perm: string): boolean => {
    const userStore = useUserStore()
    return (userStore.roles.length === 1 && userStore.roles[0] === '*') || _.findIndex(route.meta.permissions, (item: any) => item.permission === perm) >= 0
}
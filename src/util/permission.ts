import _ from 'lodash'
import {useUserStore} from "../store/user"

/**
 * 检查是否有某个菜单权限
 *
 * @param route
 * @param perm
 */
const checkPerms = (route: any, perm: string): boolean => {
    const userStore = useUserStore()
    return (userStore.permissions.length === 1 && userStore.permissions[0] === '*') || _.findIndex(route.meta.permissions, (item: any) => item.permission === perm) >= 0
}

/**
 * 检查是否有某个角色
 *
 * @param role
 */
const checkRoles = (role: string): boolean => {
    const userStore = useUserStore()
    return (userStore.roles.length === 1 && userStore.roles[0] === '*') || _.findIndex(userStore.roles, (item: any) => item === role) >= 0
}

export {checkPerms, checkRoles}
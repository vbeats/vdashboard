import axios from '../../util/request'
import {MenuQueryParam} from "./IMenuParam"

// 获取顶部菜单
export function topMenus(): Promise<any> {
    return axios.post('/admin/topMenus')
}

// 用户菜单
export function menus(param?: MenuQueryParam): Promise<any> {
    return axios.post('/admin/menus', {...param})
}

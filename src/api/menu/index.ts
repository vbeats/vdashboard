import axios from '../../util/request'
import queryString from 'query-string'
import {MenuQueryParam} from "./IMenuParam"

// 获取顶部菜单
export function topMenus(): Promise<any> {
    return axios.get('/admin/topMenus')
}

// 用户菜单
export function menus(param?: MenuQueryParam): Promise<any> {
    return axios.get('/admin/menus', {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        data: param ? queryString.stringify(param) : ''
    })
}

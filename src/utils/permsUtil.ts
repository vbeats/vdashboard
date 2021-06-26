import {Permission} from "@/interface/user/permission";
import {RouteMeta} from "vue-router";
import {Actions} from "@/interface/user/actions";

export function getPerms(meta: RouteMeta): Array<Permission> {
// 处理一下meta permissions权限字段格式
    const perms: Array<Permission> = new Array<Permission>()
    meta.permissions && (meta.permissions as Array<string>).forEach(item => {
        perms.push({
            action: item.substring(0, item.indexOf(":")), perms:
                item.substring(item.indexOf(":") + 1).split(',')
        })
    })

    return perms
}


// login []
export function checkPerms(action: string, perms: Array<Permission>): Actions {
    let actions: Actions = {add: false, list: false, update: false, delete: false, export: false}

    for (let item of perms) {
        if (item.action === action) {
            actions.add = item.perms.includes('add')
            actions.update = item.perms.includes('update')
            actions.list = item.perms.includes('list')
            actions.delete = item.perms.includes('delete')
            actions.export = item.perms.includes('export')
            break
        }
    }

    return actions
}
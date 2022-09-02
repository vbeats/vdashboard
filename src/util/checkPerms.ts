import _ from 'lodash'

export default (route: any, perm: string): boolean => {
    return _.findIndex(route.meta.buttons, (item: any) => item.key === 'add') >= 0
}
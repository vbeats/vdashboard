import axios from '../../util/request'

export function list(param?: any): Promise<any> {
    return axios.post('/admin/region/list', {...param})
}


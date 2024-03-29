import axios from '../../util/request'

// lov
export function listCategory(param: any): Promise<any> {
    return axios.get('/admin/lov/listCategory', {params: {...param}})
}

export function listLov(param: any): Promise<any> {
    return axios.get('/admin/lov/listLov', {params: {...param}})
}

export function addCategory(param: any): Promise<any> {
    return axios.post('/admin/lov/addCategory', {...param})
}

export function addLov(param: any): Promise<any> {
    return axios.post('/admin/lov/addLov', {...param})
}

export function updateCategory(param: any): Promise<any> {
    return axios.post('/admin/lov/updateCategory', param)
}

export function updateLov(param: any): Promise<any> {
    return axios.post('/admin/lov/updateLov', param)
}

export function deleteCategory(param: any): Promise<any> {
    return axios.post('/admin/lov/deleteCategory', param)
}

export function deleteLov(param: any): Promise<any> {
    return axios.post('/admin/lov/deleteLov', param)
}


// **************** 默认值集配置 *******************
export function listLovDefault(param: any): Promise<any> {
    return axios.get('/admin/lov/listLovDefault', {params: {...param}})
}

export function addLovDefault(param: any): Promise<any> {
    return axios.post('/admin/lov/addLovDefault', {...param})
}

export function updateLovDefault(param: any): Promise<any> {
    return axios.post('/admin/lov/updateLovDefault', param)
}

export function deleteLovDefault(param: any): Promise<any> {
    return axios.post('/admin/lov/deleteLovDefault', param)
}
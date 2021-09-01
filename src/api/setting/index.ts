import axios from '@/util/request'

/*
*  更新用户信息
* */
export function updateUserProfile (params: any): Promise<any> {
  return axios.post('/admin/setting/update_user_profile', { ...params })
}

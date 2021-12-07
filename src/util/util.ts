import _ from 'lodash'

// 对象 深拷贝-->state
const mapValueToState = (state: any, params: any) => {
  const keys = _.keys(params)
  keys.forEach((k) => (state[k] = params[k]))
}

export {mapValueToState}
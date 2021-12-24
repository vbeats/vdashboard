import _ from 'lodash'

// 对象 深拷贝--> target object
const deepCopy = (source: any, target: any) => {
  const keys = _.keys(source)
  keys.forEach((k: string) => (target[k] = source[k]))
  const targetKeys = _.keys(target)
  targetKeys.forEach((k: string) => {
    if (keys.indexOf(k) < 0) {
      target[k] = undefined
    }
  })
}

export {deepCopy}

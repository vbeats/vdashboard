import _ from 'lodash'

// 对象 深拷贝--> target object 不会保留target对象原有属性值
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

// 会保留state对象原有属性值
const mapToState = (source: any, state: any) => {
  const keys = _.keys(source)
  keys.forEach((k) => (state[k] = source[k]))
}

export {deepCopy, mapToState}

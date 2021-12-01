import _ from 'lodash'

const mapValueToState = (state: any, params: any) => {
  const keys = _.keys(params)
  keys.forEach((k) => (state[k] = params[k]))
}

export {mapValueToState}

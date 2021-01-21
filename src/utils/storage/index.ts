const store = require('store')
const expirePlugin = require('store/plugins/expire')
const updatePlugin = require('store/plugins/update')

store.addPlugin(expirePlugin)
store.addPlugin(updatePlugin)

export default store
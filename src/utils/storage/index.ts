import store from 'store'
import expirePlugin from 'store/plugins/expire'
import updatePlugin from 'store/plugins/update'

store.addPlugin(expirePlugin)
store.addPlugin(updatePlugin)

export default store
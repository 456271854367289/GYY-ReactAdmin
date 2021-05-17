
import store from 'store';

const USER_KEY ='user_key'// eslint-disable-next-line
export default {
     saveUser (user) {
        store.set(USER_KEY,user)
    },
    getUser  () {
       return store.get(USER_KEY) || {}
    },
    removeUser  (user) {
        store.remove(USER_KEY)
    }
}
import instance from './instance'

export function getUserInfo() {
  return instance.get('/user/info')
}

export function updateUserInfo(params) {
  return instance.post('/user/update', params)
}

export function register(params) {
  return instance.post('/register', params)
}

export function login(params) {
  return instance.post('/login', params)
}

export function findFriend(params) {
  return instance.post('/findFriend', params)
}

export function addFriend(params) {
  return instance.post('/friendRequest', params)
}

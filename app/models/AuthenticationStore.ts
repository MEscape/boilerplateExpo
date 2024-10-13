import { Instance, SnapshotOut, types } from 'mobx-state-tree'

export const AuthenticationStoreModel = types
  .model('AuthenticationStore')
  .props({
    authToken: types.maybe(types.string),
    email: '',
    password: '',
  })
  .views(store => ({
    get isAuthenticated() {
      return !!store.authToken
    },
  }))
  .actions(store => ({
    logout() {
      store.authToken = undefined
      store.email = ''
      store.password = ''
    },
    setEmail(value: string) {
      store.email = value.replace(/ /g, '')
    },
    setPassword(value: string) {
      store.password = value.replace(/ /g, '')
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

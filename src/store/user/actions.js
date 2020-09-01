import UsersApi from '../../api/user';
import * as UserService from '../../services/User';

const usersApi = new UsersApi();

export async function authenticate(_, payload) {
  const user = await usersApi.authenticate(payload);
  UserService.setUser(user.result);
  return user;
}

export async function signup(_, payload) {
  const user = await usersApi.create(payload);
  return user;
}

export async function signOut() {
  UserService.removeUser();
}

import UsersApi from '../../api/user';
import ProfessionalsApi from '../../api/professionals';
import * as UserService from '../../services/User';

const usersApi = new UsersApi();
const professionalsApi = new ProfessionalsApi();

export async function authenticate(_, payload) {
  const user = await usersApi.authenticate(payload);
  UserService.setUser(user.result);
  return user;
}

export async function signup(_, payload) {
  const user = await usersApi.create(payload);
  return user;
}

export async function createProfessional(_, payload) {
  const professional = await professionalsApi.create(payload);
  return professional;
}

export async function signOut() {
  UserService.removeUser();
}

export async function saveDeviceToken(_, payload) {
  await usersApi.saveDeviceToken(payload);
}

export async function updatePassword(_, payload) {
  await usersApi.updatePassword(payload);
}

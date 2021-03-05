import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class UsersApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('users');
  }

  authenticate(payload) {
    return this.axiosInstance.post('users/authenticate', payload).then(r => r.data);
  }

  saveDeviceToken(payload) {
    return this.axiosInstance.post('users/save-device-token', payload).then(r => r.data);
  }

  updatePassword(payload) {
    return this.axiosInstance.post('users/update-password', payload).then(r => r.data);
  }

  getUserAvatarImage(userId) {
    return this.axiosInstance.get(`users/get-user-avatar-image/${userId}`).then(r => r.data);
  }

  recoverPassword(payload) {
    return this.axiosInstance.post('users/recover-password', payload).then(r => r.data);
  }
}

export default UsersApi;

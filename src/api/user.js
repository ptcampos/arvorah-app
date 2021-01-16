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
}

export default UsersApi;

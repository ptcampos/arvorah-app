import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class CycleApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('cycles');
  }

  getUserCycle() {
    return this.axiosInstance.get('cycles/user-cycle').then(r => r.data);
  }
}

export default CycleApi;

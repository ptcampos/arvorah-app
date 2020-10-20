import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class CyclePainApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('cycle-pains');
  }
}

export default CyclePainApi;

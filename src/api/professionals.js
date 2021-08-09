import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class ProfessionalsApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('professionals');
  }

  getAreas() {
    return this.axiosInstance.get('areas').then(r => r.data);
  }
}

export default ProfessionalsApi;

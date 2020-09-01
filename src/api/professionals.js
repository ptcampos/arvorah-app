import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class ProfessionalsApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('professionals');
  }
}

export default ProfessionalsApi;

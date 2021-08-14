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

  getProfessionalConferenceUrl(professionalUserId) {
    return this.axiosInstance
      .get(`professionals/conference-url/${professionalUserId}`)
      .then(r => r.data);
  }
}

export default ProfessionalsApi;

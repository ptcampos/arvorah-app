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

  getCycleCronogram(cycleId) {
    return this.axiosInstance.get(`cycles/cycle-cronogram/${cycleId}`).then(r => r.data);
  }

  saveInformativeContentOpenedDate(informativeContentId) {
    return this.axiosInstance
      .post(`cycles/save-informative-content-opened-date/${informativeContentId}`)
      .then(r => r.data);
  }

  saveInformativeContentRating({ informativeContentId, ...payload }) {
    return this.axiosInstance
      .post(`cycles/save-informative-content-rating/${informativeContentId}`, payload)
      .then(r => r.data);
  }

  getProfessionalCycleWithStatus(payload) {
    return this.axiosInstance
      .post('professional-cycle/professional-cycle-with-status', payload)
      .then(r => r.data);
  }
}

export default CycleApi;

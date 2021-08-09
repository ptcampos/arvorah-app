import { axiosInstance } from 'boot/axios';
import CrudApi from './crud';

class SchedulesApi extends CrudApi {
  axiosInstance = axiosInstance;

  constructor() {
    super('schedule');
  }

  async getPendingSchedules() {
    const r = await this.axiosInstance.get('schedule/user-pending-schedules');
    return r.data;
  }

  async getSchedules() {
    const r = await this.axiosInstance.get('schedule/user-schedules');
    return r.data;
  }

  async postDirectSchedule(data) {
    const r = await this.axiosInstance.post('schedule/direct-schedule', data);
    return r.data;
  }

  async updateSchedule(id, data) {
    const r = await this.axiosInstance.put(`schedule/update/${id}`, data);
    return r.data;
  }

  async cancelSchedule(id) {
    const r = await this.axiosInstance.put(`schedule/cancel/${id}`);
    return r.data;
  }
}

export default SchedulesApi;

import { axiosInstance } from 'boot/axios';

class CrudApi {
  url;

  constructor(url) {
    this.url = url;
  }

  findAll(params) {
    return axiosInstance.get(this.url, { params }).then(r => r.data);
  }

  findOne(id) {
    return axiosInstance.get(`${this.url}/${id}`).then(r => r.data);
  }

  create(payload) {
    return axiosInstance.post(this.url, payload).then(r => r.data);
  }

  update(id, payload) {
    return axiosInstance.put(`${this.url}/${id}`, payload).then(r => r.data);
  }

  remove(id) {
    return axiosInstance.delete(`${this.url}/${id}`).then(r => r.data);
  }
}

export default CrudApi;

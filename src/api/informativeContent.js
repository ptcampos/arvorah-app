import axios from 'axios';

class InformativeContentApi {
  url;

  constructor(url = `${process.env.WORDPRESS_CONTENT_API}/wp-json/wp/v2`) {
    this.url = url;
  }

  findAll(params) {
    return axios.get(`${this.url}/posts?_embed`, { params }).then(r => r.data);
  }

  findOne(id) {
    return axios.get(`${this.url}/posts/${id}?_embed`).then(r => r.data);
  }

  findCategoryBySlug(slug) {
    return axios.get(`${this.url}/categories`, { params: { slug } }).then(r => r.data);
  }
}

export default InformativeContentApi;

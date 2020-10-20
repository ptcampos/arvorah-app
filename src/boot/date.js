import moment from 'moment';

export default ({ Vue }) => {
  Vue.filter('date', (value, format) => {
    if (!value) return '';
    return moment(value).format(format);
  });
};

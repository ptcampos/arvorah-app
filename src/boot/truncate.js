import _ from 'lodash';

export default ({ Vue }) => {
  Vue.filter('truncate', (value, length = 24, separator = '') => {
    if (!value) return '';
    return _.truncate(value, {
      length,
      separator,
    });
  });
};

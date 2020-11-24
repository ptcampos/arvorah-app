import Pusher from 'pusher-js';

export default ({ Vue }) => {
  const pusher = new Pusher('24cd78c672bbb9f35fcf', {
    cluster: 'mt1',
  });
  Vue.prototype.$pusher = pusher;
};

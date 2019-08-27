import Echo from 'laravel-echo';

// @NOTE you can enable authentication like this
// import BearerToken from './BearerToken';

window.io = require('socket.io-client');

const EchoClient = new Echo({
  broadcaster: 'socket.io',
  host: `${window.location.hostname}:6001`,
  // auth: {
  //   headers: {
  //     Authorization: `Bearer ${BearerToken}`,
  //     Accept: 'application/json',
  //   },
  // },
});

export default EchoClient;
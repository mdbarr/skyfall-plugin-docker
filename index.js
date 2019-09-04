'use strict';

require('barrkeep/pp');
const Modem = require('docker-modem');

function Docker (skyfall, options) {
  this.id = skyfall.utils.id();

  const modem = new Modem(options);

  const optsf = {
    path: '/events?',
    method: 'GET',
    options: {},
    isStream: true,
    statusCodes: {
      200: true,
      500: 'server error'
    }
  };

  modem.dial(optsf, (error, stream) => {
    if (error) {
      return console.log(error);
    }

    stream.on('data', (data) => {
      try {
        const event = JSON.parse(data);
        console.pp(event);

        skyfall.events.emit({
          type: `docker:${ event.Type }:${ event.Action }`,
          data: event
        });
      } catch (error) {
        console.log(error);
      }
    });

    return stream;
  });
}

module.exports = {
  name: 'docker',
  install: (skyfall, options) => {
    skyfall.docker = new Docker(skyfall, options);
  }
};

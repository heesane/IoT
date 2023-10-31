import { IOTPApplication as IOTPApplication } from './application';
import { ApplicationConfig } from '@loopback/core';
import fs from 'fs';

async function main(options: ApplicationConfig = {}) {
  const app = new IOTPApplication(options);
  await app.boot();
  await app.start();
  const url = app.restServer.url;

  console.log(`Server running at ${url}`);
}

let config = {
  rest: {
    port: +(process.env.PORT ?? 2009),
    //host: process.env.HOST ?? '0.0.0.0',
    openApiSpec: {
      // useful when used with OpenAPI-to-GraphQL to locate your application
      setServersFromRequest: true,
    },

    protocol: 'http',
  },
};

let ssl_key = process.env.SSL_KEY || './certs/iothub.key';
let ssl_crt = process.env.SSL_CRT || './certs/iothub.crt';
if (fs.existsSync(ssl_key)) {
  config['rest']['protocol'] = 'https';
  config['rest']['key'] = fs.readFileSync(ssl_key);
  config['rest']['cert'] = fs.readFileSync(ssl_crt);
}

main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
});

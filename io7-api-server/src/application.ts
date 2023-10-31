import { RestApplication } from '@loopback/rest';
import { BootMixin } from '@loopback/boot';
import { RepositoryMixin } from '@loopback/repository';
import { UserDataSource } from './datasources';
import { ServiceMixin } from '@loopback/service-proxy';
import { ApplicationConfig } from '@loopback/core';
import { AuthenticationComponent } from '@loopback/authentication';
import {
  JWTAuthenticationComponent,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import path from 'path';
import {mqttConnection} from './dynsec/mqttConnection.js';

declare global {
  var mqtt_client: object;
}
export class IOTPApplication extends BootMixin(
    ServiceMixin(RepositoryMixin(RestApplication))) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.projectRoot = __dirname;

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    global.mqtt_client = mqttConnection();

    this.component(RestExplorerComponent);
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(UserDataSource, UserServiceBindings.DATASOURCE_NAME);
  }
}

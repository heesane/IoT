import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'devices',
  connector: 'memory',
  localStorage: '',
  file: './data/devices.json'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DevicesDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'devices';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.devices', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

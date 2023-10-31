import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevicesDataSource} from '../datasources';
import {Device, DeviceRelations} from '../models';

export class DeviceRepository extends DefaultCrudRepository<
  Device,
  typeof Device.prototype.devId,
  DeviceRelations
> {
  constructor(
    @inject('datasources.devices') dataSource: DevicesDataSource,
  ) {
    super(Device, dataSource);
  }
}

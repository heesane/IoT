import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevicesDataSource} from '../datasources';
import {AppId, AppIdRelations} from '../models';

export class AppIdRepository extends DefaultCrudRepository<
  AppId,
  typeof AppId.prototype.appId,
  AppIdRelations
> {
  constructor(
    @inject('datasources.devices') dataSource: DevicesDataSource,
  ) {
    super(AppId, dataSource);
  }
}

import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DevicesDataSource} from '../datasources';
import {Role, RoleRelations} from '../models';

export class RoleRepository extends DefaultCrudRepository<
  Role,
  typeof Role.prototype.roleId,
  RoleRelations
> {
  constructor(
    @inject('datasources.devices') dataSource: DevicesDataSource,
  ) {
    super(Role, dataSource);
  }
}

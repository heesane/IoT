import {Entity, model, property} from '@loopback/repository';

@model()
export class Role extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  roleId: string;

  @property({
    type: 'string',
  })
  roleDesc?: string;

  @property({
    type: Date,
    required: true,
    generated: false,
  })
  createdDate: Date;

  constructor(data?: Partial<Role>) {
    super(data);
  }
}

// This model is for the input fields for assignRole/revoeRole REST API
@model()
export class DeviceRoleSchema extends Entity {
  @property({
    type: 'string',
    required : true
  })
  roleId: string;

  @property({
    type: 'string',
    required: true,
  })
  devId: string;
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations;

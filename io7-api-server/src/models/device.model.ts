import {Entity, model, property} from '@loopback/repository';

@model()
export class Device extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  devId: string;

  @property({
    type: 'string',
    generated: false,
    required: true,
  })
  type: string;

  @property({
    type: 'string',
  })
  devDesc?: string;

  @property({
    type: 'string',
  })
  devMaker: string;

  @property({
    type: 'string',
  })
  devSerial: string;

  @property({
    type: 'string',
  })
  devModel: string;

  @property({
    type: 'string',
  })
  devHwVer: string;

  @property({
    type: 'string',
  })
  devFwVer: string;
  
  @property({
    type: 'string',
    required: true,
  })
  createdBy: string;

  @property({
    type: Date,
  })
  createdDate: Date;

  constructor(data?: Partial<Device>) {
    super(data);
  }
}

@model()
export class NewDevice extends Device {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

@model()
export class Meta extends Object {
  @property({
    type: 'object',
    required: true,
  })
  metadata: object;
}

@model()
export class Firmware extends Object {
  @property({
    type: 'string',
    required: true,
  })
  fw_url: string;
}

export interface DeviceRelations {
  // describe navigational properties here
}

export type DeviceWithRelations = Device & DeviceRelations;

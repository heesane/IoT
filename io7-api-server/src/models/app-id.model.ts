import {Entity, model, property} from '@loopback/repository';

@model()
export class AppId extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  appId: string;

  @property({
    type: 'string',
  })
  appDesc?: string;

  @property({
    type: Date,
    required: true,
    generated: false,
  })
  createdDate: Date;

  constructor(data?: Partial<AppId>) {
    super(data);
  }
}

@model()
export class NewAppId extends AppId {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
export interface AppIdRelations {
  // describe navigational properties here
}

export type AppIdWithRelations = AppId & AppIdRelations;

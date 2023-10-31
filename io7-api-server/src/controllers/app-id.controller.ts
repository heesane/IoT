import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {AppId, NewAppId} from '../models';
import {AppIdRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import { createAppId, deleteAppId } from '../dynsec/app-id.dynsec.js';
import { getDynSecClient } from '../dynsec/dynsec_utils.js';

@authenticate('jwt')
export class AppIdController {
  constructor(
    @repository(AppIdRepository)
    public appIdRepository : AppIdRepository,
  ) {}

  @post('/app-ids')
  @response(200, {
    description: 'AppId model instance',
    content: {'application/json': {schema: getModelSchemaRef(AppId)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewAppId),
        },
      },
    })
    appId: NewAppId,
  ): Promise<AppId> {
    createAppId(appId);
    delete appId['password'];
    return this.appIdRepository.create(appId);
  }

  @get('/app-ids')
  @response(200, {
    description: 'Array of AppId model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AppId),
        },
      },
    },
  })
  async find(
    @param.filter(AppId) filter?: Filter<AppId>,
  ): Promise<AppId[]> {
    let result = await this.appIdRepository.find(filter);
    let appIdList = [];
    result.forEach((_app) => {
      let _appResp = {
        appId : _app['appId'],
        appDesc : _app['appDesc'],
        createdDate : _app['createdDate'],
      }
      try {
        let mqAppId = getDynSecClient(_app.appId);
        _appResp['roles'] = mqAppId['roles']
      } catch(e) {
        console.log(`appid(${_app.appId}) missing mqtt role`)
      }
      appIdList.push(_appResp)
    })
    return appIdList;
  }

  @get('/app-ids/{appId}')
  @response(200, {
    description: 'AppId model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AppId),
      },
    },
  })
  async findById(
    @param.path.string('appId') appId: string,
  ): Promise<AppId> {
    let _appId = await this.appIdRepository.findById(appId, {});

    let appIdResp = getDynSecClient(appId);
    appIdResp['appId'] = _appId['appId'];
    appIdResp['appDesc'] = _appId['appDesc'];
    appIdResp['createdDate'] = _appId['createdDate'];
    delete appIdResp['password'];
    delete appIdResp['salt'];
    delete appIdResp['iterations'];

    return appIdResp;
  }

  @del('/app-ids/{appId}')
  @response(204, {
    description: 'AppId DELETE success',
  })
  async deleteById(@param.path.string('appId') appId: string): Promise<void> {
    let theAppId = getDynSecClient(appId);
    if (theAppId) {
      if (theAppId.roles[0].rolename == '$apps') {
        deleteAppId(appId);
        await this.appIdRepository.findById(appId);
        this.appIdRepository.deleteById(appId);
      } else {
        console.log(`trying to delete an appId(${appId}), but it doesn'thave appid role`);
      }
    } else {    // it is the case there is no dynsec client object for the id.
      await this.appIdRepository.findById(appId);
      this.appIdRepository.deleteById(appId);
    }
  }
}

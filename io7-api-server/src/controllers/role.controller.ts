import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  del,
  patch,
  requestBody,
  SchemaObject,
} from '@loopback/rest';
import {Role, DeviceRoleSchema} from '../models';
import {RoleRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import { createAppRole, assign, revoke, dynsec_json_file } from '../dynsec/role.dynsec.js';
import {readFile} from 'fs/promises';

@authenticate('jwt')
export class RoleController {
  constructor(
    @repository(RoleRepository)
    public roleRepository : RoleRepository,
  ) {}

  @post('/appRole', {
    responses: {
      200: {
        description: 'Role model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Role) } },
      }
    },
    'x-visibility': 'undocumented',
  })
  async create(
  ): Promise<Role> {
    let role = {
      roleId : '$apps',
      roleDesc : ''
    }
    createAppRole(role);
    return this.roleRepository.create(role);
  }

  @get('/roles', {
    responses : {
      200 : {
        description: 'Array of Role model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Role),
            },
          },
        },
      }
    },
    'x-visibility': 'undocumented',
  })
  async find(
    @param.filter(Role) filter?: Filter<Role>,
  ): Promise<Role[]> {
    const data = await readFile(dynsec_json_file, 'utf-8');
    let dynsec_json = JSON.parse(data);
    let list = dynsec_json.roles.filter( r => 
      r.rolename !== 'admin' && 
      r.rolename !== '$apps'
    );
    let result = [];
    for (let i = 0; i < list.length; i++) { 
      let aRole = {
        'roleId': list[i].rolename,
      }
      try {
        const lb_role = await this.roleRepository.findById(list[i].rolename);
        aRole['roleDesc'] = lb_role.roleDesc;
        aRole['createdDate'] = lb_role.createdDate;
      } catch (e) {
        aRole['roleDesc'] = undefined;
        aRole['createdDate'] = undefined;
      }
      result.push(aRole);
    }
    return result;
  }

  @get('/roles/{roleId}', {
    responses: {
      200: {
        description: 'Role model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Role),
          },
        },
      }
    },
    'x-visibility': 'undocumented',
  })
  async findById(
    @param.path.string('roleId') roleId: string,
  ): Promise<Role> {
    const data = await readFile(dynsec_json_file, 'utf-8');
    let dynsec_json = JSON.parse(data);
    let aRoleId = dynsec_json.roles.filter(r => r.rolename == roleId)[0];
    return aRoleId;
  }

  @patch('/roleAssign', {
    responses: {
      200: {
        description: 'assign/deassigne role',
      }
    },
    'x-visibility': 'undocumented',
  })
  async assignRole(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceRoleSchema),
        },
      },
    })
    deviceRole : DeviceRoleSchema,
  ): Promise<object> {
    console.log(deviceRole);
    assign(deviceRole)
    return {
      name: deviceRole.devId,
      name2: deviceRole.roleId
    }
  }

  @patch('/roleEvoke', {
    responses: {
      200: {
        description: 'assign/deassigne role',
      }
    },
    'x-visibility': 'undocumented',
  })
  async revokeRole(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DeviceRoleSchema),
        },
      },
    })
    deviceRole : DeviceRoleSchema,
  ): Promise<object> {
    console.log('assign?');
    revoke(deviceRole)
    return {
      name: deviceRole.devId,
      name2: deviceRole.roleId
    }
  }
}

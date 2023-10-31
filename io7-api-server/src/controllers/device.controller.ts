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
  requestBody,
  response,
} from '@loopback/rest';
import {Device, NewDevice, Meta, Firmware} from '../models';
import {DeviceRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';
import { createDevice, deleteDevice, deleteRole } from '../dynsec/device.dynsec.js';
import { rebootDevice, resetDevice, updateDevice, upgradeDevice } from '../dynsec/device.action.js'
import { getDynSecClient } from '../dynsec/dynsec_utils.js';

class InvalidGateway extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 404
  }
}

class InvalidDeviceType extends Error {
  statusCode: number

  constructor(message: string) {
    super(message)
    this.statusCode = 406
  }
}

@authenticate('jwt')
export class DeviceController {
  constructor(
    @repository(DeviceRepository)
    public deviceRepository : DeviceRepository,
  ) {}

  @post('/devices')
  @response(200, {
    description: 'Device model instance',
    content: {'application/json': {schema: getModelSchemaRef(Device)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewDevice),
        },
      },
    })
    device: NewDevice,
  ): Promise<Device> {
    if (!['gateway', 'device', 'edge'].includes(device.type)) {
        throw new InvalidDeviceType('Invalid DeviceType');
    }
    if (device.type === 'edge') {
      let gw = await this.deviceRepository.findById(device.createdBy, {});
      if (gw.type !== 'gateway') {
        console.log(`${device.createdBy} is not a valid gateway`);
        throw new InvalidGateway('Invalid Gateway');
      }
    }
    device.createdDate = new Date();
    createDevice(device);
    delete device['password'];
    return this.deviceRepository.create(device);
  }

  @get('/devices')
  @response(200, {
    description: 'Array of Device model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Device),
        },
      },
    },
  })
  async find(
    @param.filter(Device) filter?: Filter<Device>,
  ): Promise<Device[]> {
    let result = await this.deviceRepository.find(filter);
    let deviceList = [];
    result.forEach((device) => {
      let _deviceResp = {
        devId : device['devId'],
        devDesc : device['devDesc'],
        createdDate : device['createdDate'],
        createdBy : device['createdBy'],
        type : device['type'],
        devMaker : device['devMaker'],
        devSerial : device['devSerial'],
        devModel : device['devModel'],
        devHwVer : device['devHwVer'],
        devFwVer : device['devFwVer'],
      }
      try {
        let m_device = getDynSecClient(device.devId);
        _deviceResp['roles'] = m_device['roles']
      } catch(e) {
        if (['device', 'gateway'].includes(device.type)) {
          console.log(`deivce(${device.devId}) missing mqtt role`)
        }
      }
      deviceList.push(_deviceResp)
    })
    return deviceList;
  }

  @get('/devices/{deviceId}')
  @response(200, {
    description: 'Device model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Device),
      },
    },
  })
  async findById(
    @param.path.string('deviceId') deviceId: string,
  ): Promise<Device> {
    let _device = await this.deviceRepository.findById(deviceId, {});

    let deviceResp;
    try {
      deviceResp = getDynSecClient(deviceId);
    } catch(e) {
      if (['device', 'gateway'].includes(_device.type)) {
        console.log(`deivce(${deviceId}) missing mqtt role`)
      }
    }
    deviceResp = {...deviceResp, 
      devId : _device['devId'],
      devDesc : _device['devDesc'],
      createdBy : _device['createdBy'],
      type : _device['type'],
      devMaker : _device['devMaker'],
      devSerial : _device['devSerial'],
      devModel : _device['devModel'],
      devHwVer : _device['devHwVer'],
      devFwVer : _device['devFwVer'],
    }
    console.log(deviceResp);
    delete deviceResp['username'];
    delete deviceResp['password'];
    delete deviceResp['salt'];
    delete deviceResp['iterations'];

    return deviceResp;
  }

  @del('/devices/{deviceId}')
  @response(204, {
    description: 'Device DELETE success',
  })
  async deleteById(@param.path.string('deviceId') deviceId: string): Promise<void> {
    try {
      let device = await this.deviceRepository.findById(deviceId);
      let m_device = getDynSecClient(deviceId);
      if (device.type === 'gateway') {
        // delete all associated roles and delete device and role
        m_device.roles.forEach((r) => {
          if (r.rolename !== deviceId) {
            deleteRole(r.rolename);
            this.deviceRepository.deleteById(r.rolename);
          }
        })
        deleteDevice(deviceId);
        deleteRole(deviceId);
      } else if (device.type === 'device') {
        // delete device and role
        deleteDevice(deviceId);
        deleteRole(deviceId);
      } else {
        // delete role
        deleteRole(deviceId);
      }
      this.deviceRepository.deleteById(deviceId);
    } catch (e) {}
  }

  @get('/devices/reboot/{deviceId}')
  @response(200, {
    description: 'Device model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Device),
      },
    },
  })
  async rebootDevice(
    @param.path.string('deviceId') deviceId: string,
  ): Promise<object> {
    let cmd =  {};
    rebootDevice(deviceId);    
    return {d:{reboot: deviceId}};
  }

  @get('/devices/reset/{deviceId}')
  @response(200, {
    description: 'Device model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Device),
      },
    },
  })
  async resetDevice(
    @param.path.string('deviceId') deviceId: string,
  ): Promise<object> {
    let cmd =  {};
    resetDevice(deviceId);    
    return {d:{reboot: deviceId}};
  }

  @post('/devices/update/{deviceId}')
  @response(200, {
    description: 'Device model instance',
    content: {'application/json': {schema: getModelSchemaRef(Meta)}},
  })
  async updateDevice(
    @param.path.string('deviceId') deviceId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Meta),
        },
      },
    })
    metadata: Meta,
  ): Promise<object> {
    updateDevice(deviceId, metadata);
    return {d:{update: deviceId}};
  }

  @post('/devices/upgrade/{deviceId}')
  @response(200, {
    description: 'Device model instance',
    content: {'application/json': {schema: getModelSchemaRef(Firmware)}},
  })
  async upgradeDevice(
    @param.path.string('deviceId') deviceId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Firmware),
        },
      },
    })
    fw_url: Firmware,
  ): Promise<object> {
    upgradeDevice(deviceId, fw_url);
    return {d:{upgrade: deviceId}};
  }
}

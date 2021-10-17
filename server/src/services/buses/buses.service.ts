import { Connection } from 'mongoose';
import { BaseService } from '../base-service';
import { BusesSchema } from '../../common/schemas/buses-schema';
import { ApiHelpers } from '../../lib/api.helpers';

export default class BusesService extends BaseService<any> {
  apiHelpers: ApiHelpers;

  constructor(connection: Connection) {
    super(connection, BusesSchema, 'buses');
    this.apiHelpers = new ApiHelpers();
  }

  public async helloBuses() {
    return {
      status: 200,
      authorized: true,
      message: 'I am a bus route serice method',
    };
  }
}

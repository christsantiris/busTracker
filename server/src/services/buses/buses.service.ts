import { Connection } from 'mongoose';
import { BaseService } from '../base-service';
import { BusesSchema } from '../../common/schemas/buses-schema';

export default class BusesService extends BaseService<any> {

  constructor(connection: Connection) {
    super(connection, BusesSchema, 'buses');
  }

  public async helloBuses() {
    return {
      status: 200,
      authorized: true,
      message: 'I am a bus route serice method',
    };
  }
}

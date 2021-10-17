import { Connection, createConnection } from 'mongoose';
import { connection as connectionOptions } from '../../config/mongo-connection';
import { AwilixContainer, Lifetime } from 'awilix';
import * as awilix from 'awilix';
import * as fg from 'fast-glob';

export class Services {
  public connection: Connection;
  public container: AwilixContainer;
  public services: { [key: string]: any } = {};
  public serviceTypes: Array<any> = [];

  constructor() {
    this.serviceTypes = fg.sync(['!**/dist', '**/*.service.(ts|js)']);
    if (!this.serviceTypes || !this.serviceTypes.length) {
      throw new Error('Could not find any services to bind');
    }
  }

  public async createMongoConnection(): Promise<void> {
    if (!connectionOptions) {
      throw new Error('No connection information provided');
    } else if (!connectionOptions.options) {
      throw new Error('No connection options provided');
    } else if (!connectionOptions.dbUrl) {
      throw new Error('No db url provided');
    }

    const mongooseConnection = await createConnection(connectionOptions.dbUrl, connectionOptions.options);

    if (mongooseConnection) {
      this.connection = mongooseConnection;
    } else {
      throw new Error(`Can not connect to MongoDB at host ${connectionOptions.host}`);
    }
  }

  public initializeDependencies() {
    this.container = awilix.createContainer({
      injectionMode: awilix.InjectionMode.CLASSIC
    });
    this.container.register({ connection: awilix.asValue(this.connection) });
    this.container.register({ placeholder: awilix.asValue(true) });
    this.container.loadModules(['./**/*.microservice.+(ts|js)'], {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: awilix.asClass
      }
    });
    this.container.loadModules(['./**/*.service.+(ts|js)'], {
      formatName: 'camelCase',
      resolverOptions: {
        lifetime: Lifetime.SINGLETON,
        register: awilix.asClass
      }
    });
  }

  public async resolveServices(): Promise<any> {
    for (const serviceLocation of this.serviceTypes) {
      const service = (await import(serviceLocation.replace(/^src\/services\//, './'))).default;
      const serviceName = service.name.toLowerCase().replace(/services$/, '');
      this.services[serviceName] = this.container.resolve(service.name.charAt(0).toLowerCase() + service.name.slice(1));
    }
  }

  public async close() {
    if(this.container) {
      await this.connection.close();
    }
  }
}

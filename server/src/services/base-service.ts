import { Model, Document, Connection, Schema } from 'mongoose';
import { cloneDeep } from 'lodash';

export abstract class BaseService<TModel> {
  public model: Model<TModel & Document>;

  constructor(public readonly connection: Connection, protected readonly schema: Schema, protected readonly collectionName: string) {
    this.model = this.connection.model<any>(this.collectionName, this.schema);
  }

  public async create(document: TModel, options?: any): Promise<TModel> {
    const documentClone: any = cloneDeep(document);
    return await this.model.create(documentClone, options);
  }

  public async find(options?: any): Promise<Array<TModel>> {
    return await this.model.find(options).lean();
  }

  public async findOne(query: any): Promise<TModel> {
    return await this.model.findOne(query).lean();
  }
}

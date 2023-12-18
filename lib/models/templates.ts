import { Db, Collection, WithId, ObjectId } from 'mongodb';

export interface Templates {
  _id?: ObjectId,
  name: string,
  subject: string,
  html: string,
}

export class TemplatesDAO {
  private collection: Collection<Templates>;

  constructor(db: Db) {
    this.collection = db.collection<Templates>('templates');
  }

  async getAll(query: Object): Promise<Templates[] | []> {
    return await this.collection.find(query).toArray();
  }

  async getByQuery(query: Object): Promise<Templates> {
    const result = await this.collection.find(query).toArray()
    return result[0];
  }

  async updateByQuery(query: Object, update: Object): Promise<WithId<Templates> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
    return result;
  }

  async create(Templates: Templates): Promise<void> {
    await this.collection.insertOne(Templates);
  }
}

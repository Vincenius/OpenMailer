import { Db, Collection, WithId, ObjectId } from 'mongodb';

export interface Settings {
  _id?: ObjectId,
  name: string,
  email: string,
  confirm_redirect: string,
  api_key: string,
  database: string,
  sending_type: string, // 'email' or 'ses'
  ses_key?: string,
  ses_secret?: string,
  ses_region?: string,
  email_pass?: string,
  email_host?: string,
}

export class SettingsDAO {
  private collection: Collection<Settings>;

  constructor(db: Db) {
    this.collection = db.collection<Settings>('settings');
  }

  async getAll(query: Object): Promise<Settings[] | []> {
    return await this.collection.find(query).toArray();
  }

  async getByQuery(query: Object): Promise<Settings> {
    const result = await this.collection.find(query).toArray()
    return result[0];
  }

  async updateByQuery(query: Object, update: Object): Promise<WithId<Settings> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
    return result;
  }

  async create(settings: Settings): Promise<void> {
    await this.collection.insertOne(settings);
  }
}

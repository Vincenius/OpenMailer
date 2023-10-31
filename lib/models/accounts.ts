import { Db, Collection, WithId, ObjectId } from 'mongodb';

export interface Account {
  _id?: ObjectId,
  email: string,
  base_url: string,
  api_key: string,
  cors_origin: string,
  confirm_redirect: string,
  sending_type: string, // 'email' or 'ses'
  ses_user?: string,
  ses_password?: string,
  ses_region?: string,
  email_user?: string,
  email_pass?: string,
  email_host?: string,
}

export class AccountDAO {
  private collection: Collection<Account>;

  constructor(db: Db) {
    this.collection = db.collection<Account>('accounts');
  }

  async getAll(query: Object): Promise<Account[] | []> {
    return await this.collection.find(query).toArray();
  }

  async getByQuery(query: Object): Promise<Account> {
    const result = await this.collection.find(query).toArray()
    return result[0];
  }

  async updateByQuery(query: Object, update: Object): Promise<WithId<Account> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
    return result;
  }

  async create(user: Account): Promise<void> {
    await this.collection.insertOne(user);
  }
}

import { Db, Collection, MongoClient, ObjectId } from 'mongodb';

export interface Accounts {
  _id?: ObjectId,
  username: string,
  password: string,
  api_key: string,
  database: string,
}

export class AccountsDAO {
  private collection: Collection<Accounts>;

  constructor(db: Db) {
    this.collection = db.collection<Accounts>('accounts');
  }

  async getAll(query: Object): Promise<Accounts[] | []> {
    return await this.collection.find(query).toArray();
  }
}

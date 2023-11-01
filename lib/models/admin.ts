import { Db, Collection, ObjectId } from 'mongodb';

export interface Accounts {
  _id?: ObjectId,
  username: string,
  password: string,
  role: string, // admin (maybe restricted roles added in future)
  api_key: string,
  database: string,
}

export interface Settings {
  initialized: boolean,
  base_url: string,
  cross_origin: string,
}

export class AdminDAO {
  // change to admin with accounts & settings collections
  private settingsCollection: Collection<Settings>;
  private accountsCollection: Collection<Accounts>;

  constructor(db: Db) {
    this.settingsCollection = db.collection<Settings>('settings');
    this.accountsCollection = db.collection<Accounts>('accounts');
  }

  async getSettings(): Promise<Settings> {
    const result = await this.settingsCollection.find().toArray()
    return result[0];
  }

  async getAllAccounts(query: Object): Promise<Accounts[] | []> {
    return await this.accountsCollection.find(query).toArray();
  }
}

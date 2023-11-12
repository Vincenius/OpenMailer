import { Db, Collection, ObjectId, WithId } from 'mongodb';

export interface Account {
  _id?: ObjectId,
  username: string,
  password: string,
  role: string, // admin (maybe restricted roles added in future)
}

export interface Newsletter {
  _id?: ObjectId,
  name: string,
  database: string,
}

export interface Settings {
  _id?: ObjectId,
  base_url: string,
  cors_origin: string,
  newsletters: Newsletter[],
}

export class AdminDAO {
  // change to admin with accounts & settings collections
  private settingsCollection: Collection<Settings>;
  private accountsCollection: Collection<Account>;

  constructor(db: Db) {
    this.settingsCollection = db.collection<Settings>('settings');
    this.accountsCollection = db.collection<Account>('accounts');
  }

  async getSettings(): Promise<Settings> {
    const result = await this.settingsCollection.find().toArray()
    return result[0];
  }

  async createSettings(settings: Settings): Promise<void> {
    await this.settingsCollection.insertOne(settings);
  }

  async updateSettings(query: Object, update: Object): Promise<WithId<Settings> | null> {
    const result = await this.settingsCollection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
    return result;
  }

  async getAllByQuery(query: Object): Promise<Account[] | []> {
    return await this.accountsCollection.find(query).toArray();
  }

  async createAccount(user: Account): Promise<void> {
    await this.accountsCollection.insertOne(user);
  }
}

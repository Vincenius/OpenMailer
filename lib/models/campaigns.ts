import { Db, Collection, ObjectId, WithId } from 'mongodb';

interface Users {
  id: string,
  opens: number,
  clicks: string[],
}

export interface Campaign {
  _id?: ObjectId,
  id: string,
  createdAt: Date;
  subject: string;
  html: string;
  users: Users[];
}

export class CampaignDAO {
  private collection: Collection<Campaign>;

  constructor(db: Db) {
    this.collection = db.collection<Campaign>('campaigns');
  }

  async getAll(): Promise<Campaign[] | []> {
    return await this.collection.find().toArray();
  }

  async getByQuery(query: Object): Promise<Campaign> {
    const result = await this.collection.find(query).toArray()
    return result[0];
  }

  async addUserByQuery(query: Object, update: Users): Promise<WithId<Campaign> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $push: { users: update } },
      { returnDocument: 'after' }
    )
    return result;
  }

  async trackOpen(campaignId: string, userId: string): Promise<WithId<Campaign> | null> {
    const result = await this.collection.findOneAndUpdate(
      {
        id: campaignId,
        'users.id': userId,
      },
      { $inc: { 'users.$.opens': 1 }},
      { returnDocument: 'after' }
    )
    return result;
  }

  async trackClick(campaignId: string, userId: string, link: string): Promise<WithId<Campaign> | null> {
    const result = await this.collection.findOneAndUpdate(
      {
        id: campaignId,
        'users.id': userId,
      },
      { $push: { 'users.$.clicks': link }},
      { returnDocument: 'after' }
    )
    return result;
  }

  // async updateUserByQuery(campaignId: string, userId: string, update: Object): Promise<WithId<Campaign> | null> {
  //   const mappedUpdate = Object.entries(update).reduce((acc, [key, value]) => ({
  //     ...acc,
  //     [`users.$.${key}`]: value,
  //   }))
  //   console.log('DBG', mappedUpdate)
  //   const result = await this.collection.findOneAndUpdate(
  //     {
  //       id: campaignId,
  //       'users.id': userId,
  //     },
  //     { $set: mappedUpdate },
  //     { returnDocument: 'after' }
  //   )
  //   return result;
  // }

  async create(user: Campaign): Promise<void> {
    await this.collection.insertOne(user);
  }
}

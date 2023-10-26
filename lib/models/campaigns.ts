import { Db, Collection, ObjectId, WithId } from 'mongodb';

export interface User {
  id: string,
  status: string,
  opens: number,
  clicks: string[],
}

export interface Campaign {
  _id?: ObjectId,
  id: string,
  createdAt: Date;
  subject: string;
  html: string;
  // todo status = pending, sending, failed, done
  users: User[];
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

  async getLatest(): Promise<Campaign | null> {
    const result = await this.collection.findOne({}, {sort: {createdAt: -1}})
    return result
  }

  async addUserByQuery(query: Object, update: User): Promise<WithId<Campaign> | null> {
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
    console.log('TRACK', userId, link)
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

  async updateStatus(campaignId: string, userId: string, status: string): Promise<WithId<Campaign> | null> {
    const result = await this.collection.findOneAndUpdate(
      {
        id: campaignId,
        'users.id': userId,
      },
      { $set: { 'users.$.status': status } },
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

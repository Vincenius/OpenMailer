import { Db, Collection, WithId, ObjectId } from 'mongodb';

export interface Subscriber {
  _id?: ObjectId,
  email: string;
  createdAt: Date;
  name: string | null;
  groups: string[];
  confirmed: boolean;
  confirmationId: string,
  received: number,
  opened: number,
  clicked: number,
  location?: string;
  unsubscribedAt?: Date,
}

export class SubscriberDAO {
  private collection: Collection<Subscriber>;

  constructor(db: Db) {
    this.collection = db.collection<Subscriber>('subscribers');
  }

  async getAll(query: Object): Promise<Subscriber[] | []> {
    return await this.collection.find(query).toArray();
  }

  async getByQuery(query: Object): Promise<Subscriber> {
    const result = await this.collection.find(query).toArray()
    return result[0];
  }

  async getCount(query: Object): Promise<number> {
    return await this.collection.countDocuments(query);
  }

  async updateByQuery(query: Object, update: Object): Promise<WithId<Subscriber> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $set: update },
      { returnDocument: 'after' }
    )
    return result;
  }

  async increaseTrack(query: Object, field: string): Promise<WithId<Subscriber> | null> {
    const result = await this.collection.findOneAndUpdate(
      query,
      { $inc: { [field]: 1 } },
      { returnDocument: 'after' }
    )
    return result;
  }

  async create(user: Subscriber): Promise<void> {
    await this.collection.insertOne(user);
  }
}

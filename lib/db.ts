import { MongoClient, Db } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

export interface CustomRequest extends NextApiRequest {
  dbClient: MongoClient;
  db: Db,
}

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI || ''
const options = {}


const withMongoDB = (
  handler: (req: CustomRequest, res: NextApiResponse) => Promise<void>,
  databaseName?: string,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    let mongoClient
    try {
      const client = new MongoClient(uri, options);
      mongoClient= await client.connect();
      const db = client.db(databaseName || process.env.DB_NAME);

      // Augment the request object with the MongoDB client and database
      const customReq: CustomRequest = Object.assign(req, {
        dbClient: client,
        db,
      });

      await handler(customReq, res);
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      if (mongoClient) {
        mongoClient.close()
      }
    }
  };
};


export default withMongoDB;

import { MongoClient, Db } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { AdminDAO } from './models/admin'
import { SettingsDAO } from './models/settings';

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
      const database = databaseName || req.headers['x-mailing-list']?.toString()
      const client = new MongoClient(uri, options);
      mongoClient= await client.connect();
      const db = client.db(database);

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

export const listExists = async (req: NextApiRequest, res: NextApiResponse, listName: string) => {
  let mongoClient
  try {
    const client = new MongoClient(uri, options);
    mongoClient= await client.connect();
    const db = client.db('settings');
    const adminDAO = new AdminDAO(db)
    const settings = await adminDAO.getSettings()

    return settings && !!settings.newsletters.find(newsletter => newsletter.database === listName)
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    if (mongoClient) {
      mongoClient.close()
    }
  }
}

export const getSettings = async (listName: string) => {
  let mongoClient
  try {
    const client = new MongoClient(uri, options);
    mongoClient= await client.connect();
    const db = client.db('settings');
    const adminDAO = new AdminDAO(db)
    const settings = await adminDAO.getSettings()

    const newsletterDb = client.db(listName);
    const settingsDAO = new SettingsDAO(newsletterDb)
    const newsletterSettings = await settingsDAO.getAll({})

    return {
      ...settings,
      ...newsletterSettings[0],
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return null
  } finally {
    if (mongoClient) {
      mongoClient.close()
    }
  }
}

export default withMongoDB;

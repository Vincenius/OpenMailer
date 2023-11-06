import type { NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Settings, SettingsDAO } from '../../../lib/models/settings'

type Result = {
  message: string,
}

// rename settings
async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result | Settings[]>
) {
  if (req.method === 'GET') {
    const settingsDAO = new SettingsDAO(req.db);
    const result = await settingsDAO.getAll({});

    res.status(200).json(result)
  } else if (req.method === 'POST') {
    // todo
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler);
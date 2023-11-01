import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Accounts, AdminDAO } from '../../../lib/models/admin'

type Result = {
  message: string,
} | {
  exists: boolean,
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'GET') {
    const adminDAO = new AdminDAO(req.db);
    const settings = await adminDAO.getSettings();

    res.status(200).json({ exists: !!(settings && settings.initialized) })
  } else if (req.method === 'POST') {
    // allow first without auth
    // then only with auth
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler, 'accounts');
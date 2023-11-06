import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { AdminDAO } from '../../../lib/models/admin'
import withAuth from '../../../lib/auth';

type Result = {
  message: string,
} | {
  exists: boolean,
}

const updateSettings = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const adminDAO = new AdminDAO(req.db);
  const settings = await adminDAO.getSettings();

  if (!settings) {
    await adminDAO.createSettings({
      ...req.body,
      initialized: false,
    })
  } else {
    await adminDAO.updateSettings({ _id: settings._id }, {
      ...req.body,
      initialized: false,
    })
  }

  res.status(200).json({ message: 'success' })
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
    await withAuth(req, res, updateSettings)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler, 'settings');
import type { NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { AdminDAO, Settings } from '../../../lib/models/admin'
import withAuth from '../../../lib/auth';
import { authOptions } from "../api/auth/[...nextauth]"

const getDBName = (inputString: string) => {
  let modifiedString = inputString.toLowerCase();
  modifiedString = modifiedString.replace(/[^\w\s]/g, ''); // Remove special characters
  modifiedString = modifiedString.replace(/\s+/g, '-'); // Replace spaces with "-"
  return modifiedString;
}

type Result = {
  message: string,
} | {
  initialized: boolean,
} | Settings

const updateSettings = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const adminDAO = new AdminDAO(req.db);
  const settings = await adminDAO.getSettings();

  if (!settings) {
    await adminDAO.createSettings(req.body)
  } else {
    await adminDAO.updateSettings({ _id: settings._id }, req.body)
  }

  res.status(200).json({ message: 'success' })
}

const addNewsletter = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const adminDAO = new AdminDAO(req.db);
  const settings = await adminDAO.getSettings();

  let dbName = getDBName(req.body.name);
  let i = 1
  while (settings.newsletters.find((n) => n.database === dbName)) {
    i++;
    dbName = `${getDBName(req.body.name)}-${i}`
  }

  await adminDAO.updateSettings({ _id: settings._id }, {
    newsletters: [
      ...settings.newsletters,
      {
        name: req.body.name,
        database: dbName,
      }
    ],
  })

  res.status(200).json({ message: dbName })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'GET') {
    const adminDAO = new AdminDAO(req.db);
    const settings = await adminDAO.getSettings();
    const session = await getServerSession(req, res, authOptions)
    const initialized = (settings?.newsletters || []).length > 0

    if (session) {
      res.status(200).json({ ...settings, initialized } || { initialized })
    } else {
      res.status(200).json({ initialized })
    }
  } else if (req.method === 'POST') {
    await withAuth(req, res, updateSettings)
  } else if (req.method ==='PUT') {
    await withAuth(req, res, addNewsletter)
  } {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler, 'settings');
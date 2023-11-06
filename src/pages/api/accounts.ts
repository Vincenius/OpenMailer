import type { NextApiResponse } from 'next'
import { createHash } from 'crypto'
import withAuth from '../../../lib/auth';
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Account, AdminDAO } from '../../../lib/models/admin'

type Result = {
  message: string,
} | {
  exists: boolean,
}

const createAccount = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const adminDAO = new AdminDAO(req.db);
  const hash = createHash('sha256');
  hash.update(req.body.password);
  const hashedPassword = hash.digest('hex');

  await adminDAO.createAccount({
    username: req.body.username,
    password: hashedPassword,
    role: 'admin',
  })

  res.status(200).json({ message: 'success' })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'POST') {
    const adminDAO = new AdminDAO(req.db);
    const accounts = await adminDAO.getAllByQuery({})
    if (accounts.length > 0) {
      await withAuth(req, res, createAccount)
    } else {
      // first account can be created without auth
      await createAccount(req, res)
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler, 'settings');
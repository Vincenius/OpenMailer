import type { NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Account, AccountDAO } from '../../../lib/models/accounts'

type Result = {
  message: string,
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result | Account[]>
) {
  if (req.method === 'GET') {
    const accountDAO = new AccountDAO(req.db);
    const result = await accountDAO.getAll({});

    res.status(200).json(result)
  } else if (req.method === 'POST') {
    // allow first without auth
    // then only with auth
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler);
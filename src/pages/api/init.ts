import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Accounts, AccountsDAO } from '../../../lib/models/accounts'

type Result = {
  message: string,
}

// rename settings
async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result | Accounts[]>
) {
  if (req.method === 'GET') {
    const accountsDAO = new AccountsDAO(req.db); // withMongoDB
    const result = await accountsDAO.getAll({});

    res.status(200).json(result)
  } else if (req.method === 'POST') {
    // allow first without auth
    // then only with auth
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler, 'accounts');
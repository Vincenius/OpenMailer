import { NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../src/pages/api/auth/[...nextauth]"
import { CustomRequest } from './db'

const withAuth = async (
  req: CustomRequest,
  res: NextApiResponse,
  handler: (req: CustomRequest, res: NextApiResponse) => Promise<void>
) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    await handler(req, res)
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

export default withAuth
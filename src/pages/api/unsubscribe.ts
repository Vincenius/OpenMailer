import type { NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import withMongoDB, { CustomRequest, listExists } from '../../../lib/db'
import { SubscriberDAO } from '../../../lib/models/subscriber'

type Result = {
  message: string,
}

const handleUnsubscribe = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const id = (req.query.id || '').toString()
  const subscriberDAO = new SubscriberDAO(req.db);
  await subscriberDAO.updateByQuery(
    { _id: new ObjectId(id) },
    { unsubscribedAt: new Date() }
  );

  res.status(200).json({ message: 'Successfully unsubscribed'})
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'GET') {
    const list = (req.query.list || '').toString()

    const validList = await listExists(req, res, req.body.list)
    if (validList) {
      await withMongoDB(handleUnsubscribe, list)(req, res)
    } else {
      res.status(400).json({ message: 'invalid link - please contact the newsletter owner' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default handler;
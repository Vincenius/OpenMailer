import type { NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { SubscriberDAO } from '../../../lib/models/subscriber'

type Result = {
  message: string,
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'GET') {
    const id = (req.query.id || '').toString()
    const subscriberDAO = new SubscriberDAO(req.db);
    await subscriberDAO.updateByQuery(
      { _id: new ObjectId(id) },
      { unsubscribedAt: new Date() }
    );

    res.status(200).json({ message: 'Successfully unsubscribed'})
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

export default withMongoDB(handler);
import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { SubscriberDAO, Subscriber } from '../../../lib/models/subscriber'

type Error = {
  message: string,
}

type Response = {
  subscribers: Subscriber[],
  total: number,
}

async function getSubscribers(req: CustomRequest, res: NextApiResponse<Response | Error>) {
  try {
    const { page = '1' } = req.query;
    const p = Array.isArray(page)
      ? parseInt(page[0], 10)
      : parseInt(page, 10);

    const subscriberDAO = new SubscriberDAO(req.db);
    const [total, subscribers] = await Promise.all([
      subscriberDAO.getCount({}),
      subscriberDAO.getAll({}, p),
    ])
    res.status(200).json({
      subscribers,
      total,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Subscriber[] | Error>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, getSubscribers)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { SubscriberDAO, Subscriber } from '../../../lib/models/subscriber'

type Result = {
  message: string,
} | {
  progress: number,
}

let globalState = { progress: 0 }

async function createSubscriber(req: CustomRequest, res: NextApiResponse<Subscriber[] | Result>) {
  try {
    const subscribers = req.body
    const subscriberDAO = new SubscriberDAO(req.db);
    globalState.progress = 0

    res.status(200).json({ message: 'success' })

    for (let i = 0; i < subscribers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      globalState.progress = (i+1)
      const { email, received = 0, opened = 0, clicked = 0, createdAt, location } = subscribers[i]
      const existingSubscriber = await subscriberDAO.getByQuery({ email })

      if (!existingSubscriber) {
        const confirmationId = uuidv4();
        await subscriberDAO.create({
          email,
          name: null,
          createdAt: new Date(createdAt),
          confirmed: true,
          confirmationId,
          groups: [],
          location: location,
          received: parseInt(received, 10),
          opened: parseInt(opened, 10),
          clicked: parseInt(clicked, 10),
        });
      }
    };
  }
  catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Subscriber[] | Result>
) {
  if (req.method === 'POST') {
    await createSubscriber(req, res)
  } else if (req.method === 'GET') {
    res.status(200).json(globalState)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
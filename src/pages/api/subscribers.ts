import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import NextCors from 'nextjs-cors';
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { SubscriberDAO, Subscriber } from '../../../lib/models/subscriber'
import { validate } from 'jsonschema';
import { sendConfirmationEmail } from '../../../lib/email';

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

async function createSubscriber(req: CustomRequest, res: NextApiResponse<Subscriber[] | Error>) {
  try {
    const schema = {
      "type": "object",
      "properties": {
        "email": {"type": "string", "format": "email",},
        "name": {"type": "string"},
        "groups": {"type": "array"},
        // "createdAt": {"type": "string"}, // for importing
      },
      "required": ["email"]
    };
    const inputValidation = validate(req.body, schema)
    if (inputValidation.errors.length) {
      res.status(400).json({ message: 'wrong input' })
    } else {
      const subscriberDAO = new SubscriberDAO(req.db);
      const existingSubscriber = await subscriberDAO.getByQuery({ email: req.body.email })

      if (!existingSubscriber) {
        const confirmationId = uuidv4();
        await subscriberDAO.create({
          email: req.body.email,
          name: req.body.name || null,
          createdAt: new Date(),
          confirmed: false,
          confirmationId,
          groups: req.body.groups || [],
          received: 0,
          opened: 0,
          clicked: 0,
        });
        await sendConfirmationEmail(req.body.email, { confirmationId })
      }

      res.status(200).json({ message: 'success' })
    }
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
  } else if (req.method === 'POST') {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'POST'],
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200,
    });

    await createSubscriber(req, res)
  } else if (req.method === 'OPTIONS') {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'POST'],
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200,
    });

    res.status(200).end()
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
import type { NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';
import NextCors from 'nextjs-cors';
import withMongoDB, { CustomRequest, listExists } from '../../../lib/db';
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

async function createSubscriber(req: CustomRequest, res: NextApiResponse<Subscriber[] | Error>) {
  try {
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
      await sendConfirmationEmail(req.body.email, { confirmationId, list: req.body.list })
    }

    res.status(200).json({ message: 'success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Subscriber[] | Error>
) {
  if (req.method === 'POST') {
    await NextCors(req, res, {
      // Options
      methods: ['GET', 'POST'],
      origin: process.env.CORS_ORIGIN,
      optionsSuccessStatus: 200,
    });

    const schema = {
      "type": "object",
      "properties": {
        "list": {"type": "string"},
        "email": {"type": "string", "format": "email",},
        "name": {"type": "string"},
        "groups": {"type": "array"},
      },
      "required": ["email", "list"]
    };
    const inputValidation = validate(req.body, schema)
    if (inputValidation.errors.length) {
      res.status(400).json({ message: 'wrong input' })
    } else {
      const validList = await listExists(req, res, req.body.list)
      if (validList) {
        await withMongoDB(createSubscriber, req.body.list)(req, res)
      } else {
        res.status(400).json({ message: 'list does not exist' })
      }
    }
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

export default handler;
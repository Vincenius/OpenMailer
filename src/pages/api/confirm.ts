import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest, listExists } from '../../../lib/db'
import { SubscriberDAO, Subscriber } from '../../../lib/models/subscriber'
import { CampaignDAO } from '../../../lib/models/campaigns'
import { sendWelcomeEmail } from '../../../lib/email'
import { campaignId as welcomeCampaignId } from '../../../lib/templates/welcome'

type Error = {
  message: string,
}

const confirmSubscriber = async (req: CustomRequest, res: NextApiResponse<Subscriber[] | Error>) => {
  const subscriberDAO = new SubscriberDAO(req.db);
  const subscriber = await subscriberDAO.getByQuery({ confirmationId: req.query.id })
  const list = req.query.list?.toString() || ''

  if (subscriber) {
    await subscriberDAO.updateByQuery(
      { confirmationId: req.query.id },
      { confirmed: true }
    );
    if (!subscriber.confirmed) {
      const campaignDAO = new CampaignDAO(req.db);
      const userId = (subscriber._id || '').toString()
      await Promise.all([
        sendWelcomeEmail(subscriber.email, { userId, list }), // todo send async by using send api
        campaignDAO.addUserByQuery({ id: welcomeCampaignId }, { id: userId, opens: 0, clicks: [], status: 'success' }),
        subscriberDAO.increaseTrack({ confirmationId: req.query.id }, 'received')
      ])
    }
    res.redirect(301, process.env.CONFIRM_REDIRECT || '/thank-you') // todo fallback thank you page
  } else {
    res.status(400).json({
      message: 'Invalid confirmation link',
    })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Subscriber[] | Error>
) {
  if (req.method === 'GET') {
    try {
      if (!req.query.id || !req.query.list) {
        res.status(400).json({
          message: 'Invalid confirmation link',
        })
      } else {
        const validList = await listExists(req, res, req.body.list)
        if (validList) {
          await withMongoDB(confirmSubscriber, req.query.list.toString())(req, res)
        } else {
          res.status(400).json({ message: 'list does not exist' })
        }
      }
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default handler;
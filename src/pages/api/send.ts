import { ObjectId } from 'mongodb';
import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import { CampaignDAO, Campaign } from '../../../lib/models/campaigns'
import { SubscriberDAO } from '../../../lib/models/subscriber'
import { sendCampaign } from '../../../lib/email';

type Result = {
  message: string,
}

async function handleCampaignSend(req: CustomRequest, res: NextApiResponse<Result>) {
  const campaignDao = new CampaignDAO(req.db);
  const subscriberDAO = new SubscriberDAO(req.db);

  const campaign = await campaignDao.getByQuery({ id: req.body.campaignId })
  const allPendingUsers = campaign.users.filter(u => u.status !== 'success')
  const sendingUsers = allPendingUsers.splice(0, 20)

  const promises = sendingUsers.map(async u => {
    const query = { _id: new ObjectId(u.id) }
    const user = await subscriberDAO.getByQuery(query)
    const result = await sendCampaign(user.email, campaign.subject, campaign.html, { userId: u.id, templateId: req.body.campaignId })

    if (result === 'success') {
      await subscriberDAO.increaseTrack(query, 'received')
    }

    return campaignDao.updateStatus(req.body.campaignId, u.id, result)
  })

  await Promise.all(promises)

  // if (allPendingUsers.length > 0) { // call recursively if pending users left
  //   fetch(`${process.env.BASE_URL}/api/send`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(req.body),
  //   })
  // }

  res.status(200).json({ message:'success' })
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Campaign[] | Result>
) {
  if (req.method === 'POST') {
    if (req.body.api_key === process.env.API_KEY) {
      await handleCampaignSend(req, res)
    } else {
      res.status(401).json({ message: 'Unauthorized' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
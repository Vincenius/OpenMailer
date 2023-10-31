import type { NextApiResponse } from 'next'
import mjml2html from 'mjml'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { CampaignDAO } from '../../../lib/models/campaigns'
import welcomeTemplate, {
  campaignId as welcomeCampaignId,
  subject as welcomeSubject,
} from '../../../lib/templates/welcome'

type Result = {
  message: string,
}

async function initDatabase(req: CustomRequest, res: NextApiResponse<Result>) {
  try {
    const campaignDao = new CampaignDAO(req.db);
    const welcomeCampaign = await campaignDao.getByQuery({ id: welcomeCampaignId });

    if (!welcomeCampaign) {
      const mjml = welcomeTemplate({ userId: 'none' })
      const htmlOutput = mjml2html(mjml)
      const html = htmlOutput.html

      await campaignDao.create({
        id: welcomeCampaignId,
        createdAt: new Date(),
        subject: welcomeSubject,
        html,
        users: []
      })
    }

    res.status(200).json({ message: 'success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, initDatabase)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
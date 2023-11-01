import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 'no-store')

  const { slug = [] } = req.query

  if (slug.length === 3) {
    const userId = atob(slug[0]);
    const campaignId = atob(slug[1]);
    const link = atob(slug[2]);

    fetch(`${process.env.BASE_URL}/api/track`, {
      cache: 'no-store',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.API_KEY,
        type: 'click',
        userId,
        campaignId,
        link,
      }),
    })

    res.redirect(301, link)
  }

  res.status(404).end()
}

export default handler
import { ImageResponse } from '@vercel/og'
import type { NextApiRequest } from 'next'
import withMongoDB, { CustomRequest } from '../../../../lib/db';

export const config = {
  runtime: 'edge',
}

const handler = (req: NextApiRequest) => {
  const {searchParams} = new URL(req.url || '');
  const params = searchParams.getAll('slug')

  if (params.length === 2) {
    const userId = params[0];
    const campaignId = params[1];

    fetch(`${process.env.BASE_URL}/api/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.TRACKING_API_KEY,
        type: 'open',
        userId,
        campaignId,
      }),
    })
  }


  return new ImageResponse(
    (<div></div>),
    {
      width: 1,
      height: 1,
    }
  )
}

export default handler
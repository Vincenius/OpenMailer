import type { NextApiResponse, NextApiRequest } from 'next'
import sendEmail from '../../../lib/email'

type Result = {
  message: string,
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  if (req.method === 'POST') {
    const result = await sendEmail(req.body.email, '[Testing email connection]', 'This is an OpenMailer test email', req.body)

    res.status(200).json({ message: result })
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default handler;
import type { NextApiResponse } from 'next'
import withMongoDB, { CustomRequest } from '../../../lib/db';
import withAuth from '../../../lib/auth';
import { Templates, TemplatesDAO } from '../../../lib/models/templates'

type Result = {
  message: string,
}

async function getTemplates(req: CustomRequest, res: NextApiResponse<Templates[] | Result>) {
  try {
    const templatesDao = new TemplatesDAO(req.db);
    const templates = await templatesDao.getAll({});
    res.status(200).json(templates)
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function updateTemplate(req: CustomRequest, res: NextApiResponse<Templates[] | Result>) {
  try {
    const templatesDao = new TemplatesDAO(req.db);
    const templates = await templatesDao.getAll({});
    const template = templates.find((t) => t.name === req.body.name);
    if (template) {
      await templatesDao.updateByQuery({ name: req.body.name }, { html: req.body.html, subject: req.body.subject });
    } else {
      await templatesDao.create(req.body)
    }

    res.status(200).json({ message: 'Success' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Templates[] | Result>
) {
  if (req.method === 'GET') {
    await withAuth(req, res, getTemplates)
  } else if (req.method === 'PUT') {
    await withAuth(req, res, updateTemplate)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }

  return Promise.resolve()
}

export default withMongoDB(handler);
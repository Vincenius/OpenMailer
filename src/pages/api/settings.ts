import type { NextApiResponse } from 'next'
import { ObjectId } from 'mongodb'
import withMongoDB, { CustomRequest } from '../../../lib/db'
import { Settings, SettingsDAO } from '../../../lib/models/settings'
import { TemplatesDAO } from '../../../lib/models/templates'
import { AdminDAO } from '../../../lib/models/admin'
import withAuth from '../../../lib/auth';
import { getSubject, getHtml } from '../../../lib/templates/confirmation'

type Result = {
  message: string,
}

const addSettings = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  const settingsDAO = new SettingsDAO(req.db);
  const templateDAO = new TemplatesDAO(req.db)
  await Promise.all([
    settingsDAO.create(req.body),
    templateDAO.create({
      name: 'confirmation',
      subject: getSubject(req.body.name),
      html: getHtml(req.body.name),
    }),
  ])

  res.status(200).json({ message:'success' })
}

const getSettings = async (req: CustomRequest, res: NextApiResponse<Settings>) => {
  const settingsDAO = new SettingsDAO(req.db);
  const result = await settingsDAO.getAll({});

  res.status(200).json(result[0])
}

const updateSettings = async (req: CustomRequest, res: NextApiResponse<Settings | null>) => {
  const settingsDAO = new SettingsDAO(req.db);
  const { _id, ...update } = req.body
  const result = await settingsDAO.updateByQuery({ _id: new ObjectId(_id) }, update);
  res.status(200).json(result)
}

const updateAdmin = async (req: CustomRequest, res: NextApiResponse<Settings | null>) => {
  const adminDAO = new AdminDAO(req.db);
  const settings = await adminDAO.getSettings();
  const updatedNewsletters = settings.newsletters.map((n) => n.database === req.body.database
    ? { ...n, name: req.body.name }
    : n)

  await adminDAO.updateSettings({ _id: settings._id }, { newsletters: updatedNewsletters });
}

const deleteNewsletter = async (req: CustomRequest, res: NextApiResponse<Settings | null>) => {
  const adminDAO = new AdminDAO(req.db);
  const settings = await adminDAO.getSettings();
  const updatedNewsletters = settings.newsletters.filter((n) => n.database !== req.body.database);

  await adminDAO.updateSettings({ _id: settings._id }, { newsletters: updatedNewsletters });
}

const deleteDatabases = async (req: CustomRequest, res: NextApiResponse<Result>) => {
  await req.db.dropDatabase()

  res.status(200).json({ message:'success' })
}

async function handleSettings(req: CustomRequest, res: NextApiResponse<Result | Settings[]>) {
  if (req.method === 'GET') {
    await withMongoDB(getSettings)(req, res)
  } else if (req.method === 'POST') {
    const { database } = req.body;

    await withMongoDB(addSettings, database)(req, res)
  } else if (req.method === 'PUT') {
    await withMongoDB(updateAdmin, 'settings')(req, res);
    await withMongoDB(updateSettings)(req, res)
  } else if (req.method === 'DELETE') {
    await withMongoDB(deleteNewsletter, 'settings')(req, res);
    await withMongoDB(deleteDatabases)(req, res)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}

async function handler(
  req: CustomRequest,
  res: NextApiResponse<Result | Settings[]>
) {
  await withAuth(req, res, handleSettings)
}

export default handler;
// import type { NextApiResponse } from 'next'
// import { v4 as uuidv4 } from 'uuid';
// import fs from 'fs';
// import { parse } from 'csv-parse/sync';
// import withMongoDB, { CustomRequest } from '../../../lib/db';
// import { SubscriberDAO, Subscriber } from '../../../lib/models/subscriber'

// type Error = {
//   message: string,
// }

// async function createSubscriber(req: CustomRequest, res: NextApiResponse<Subscriber[] | Error>) {
//   try {
//     const file = fs.readFileSync('./import.csv')
//     const subscribers = parse(file)
//     const subscriberDAO = new SubscriberDAO(req.db);

//     for (let i = 1; i < subscribers.length; i++) {
//       const sub = subscribers[i]
//       const [email, received, opened, clicked, createdAt, location] = sub
//       console.log(`CREATING ${i} / ${subscribers.length} - ${email}`)
//       const existingSubscriber = await subscriberDAO.getByQuery({ email })

//       if (!existingSubscriber) {
//         const confirmationId = uuidv4();
//         await subscriberDAO.create({
//           email,
//           name: null,
//           createdAt: new Date(createdAt),
//           confirmed: true,
//           confirmationId,
//           groups: [],
//           location: location,
//           received: parseInt(received, 10),
//           opened: parseInt(opened, 10),
//           clicked: parseInt(clicked, 10),
//         });
//       }
//     };

//     res.status(200).json({ message: 'success' })
//   }
//   catch (e) {
//     console.error(e)
//     res.status(500).json({ message: 'Internal Server Error' })
//   }
// }

// async function handler(
//   req: CustomRequest,
//   res: NextApiResponse<Subscriber[] | Error>
// ) {
//   if (req.method === 'GET') {
//     await createSubscriber(req, res)
//   } else {
//     res.status(405).json({ message: 'Method not allowed' })
//   }

//   return Promise.resolve()
// }

// export default withMongoDB(handler);
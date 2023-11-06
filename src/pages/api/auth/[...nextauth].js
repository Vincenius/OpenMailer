import { MongoClient } from 'mongodb'
import { createHash } from 'crypto'
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { AdminDAO } from '../../../../lib/models/admin'

const uri = process.env.MONGODB_URI || ''
const options = {}

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let mongoClient
        try {
          const client = new MongoClient(uri, options);
          mongoClient= await client.connect();
          const db = client.db('settings');

          const adminDAO = new AdminDAO(db);
          const [account] = await adminDAO.getAllByQuery({ username: credentials.username })
          const hash = createHash('sha256');
          hash.update(credentials.password);
          const inputPasswordHash = hash.digest('hex');

          console.log(account, inputPasswordHash)
          if (account && account.password == inputPasswordHash) {
            return { username: credentials.username }
          } else {
            return null
          }
        } catch (error) {
          console.error('Error occurred:', error);
          return null
        } finally {
          if (mongoClient) {
            mongoClient.close()
          }
        }
      }
    })
  ],
}

export default NextAuth(authOptions)
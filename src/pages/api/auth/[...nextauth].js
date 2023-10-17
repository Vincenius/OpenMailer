import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// https://next-auth.js.org/configuration/providers/credentials

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (
          credentials.username === process.env.USERNAME
          && credentials.password === process.env.PASSWORD
        ) {
          return { username: credentials.username }
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ],
}

export default NextAuth(authOptions)
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/connectdb"
import userModel from "./models/user-model"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB()
        if (!credentials?.email || !credentials?.password) return null

        const user = await userModel.findOne({ email: credentials.email }).select("+password")
        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          broker: user.broker,
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    // Save custom user fields in JWT
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          broker: user.broker,
        }
      }
      return token
    },
    // Expose custom fields in session
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }
      return session
    },
  },
})

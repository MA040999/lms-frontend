import { serverRequest } from "@/lib/serverRequest";
import HTTP_METHODS from "@/utils/httpsMethods";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {

        // try {
        //   await serverRequest(HTTP_METHODS.POST, SERVER_API_ENDPOINTS.REGISTER, {
        //     id: profile?.sub,
        //     name: profile?.name,
        //     email: profile?.email,
        //     image: profile?.image
        //   });

        //   return true;
        // } catch (error) {
        //   return false;
        // }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.id_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
    async redirect({ baseUrl }) {
      return baseUrl
    }
  },
};

export default NextAuth(authOptions);

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
    async signIn({ profile }) {
      // try {
      //   const abc = await serverRequest({
      //     method: HTTP_METHODS.POST,
      //     endPoint: SERVER_API_ENDPOINTS.ADD_NEW_USER,
      //     body: {
      //       googleId: profile?.sub,
      //       name: profile?.name,
      //       email: profile?.email,
      //       image: profile?.image,
      //     },
      //   });
      //   console.log("🚀 ~ abc:", abc);

      //   return true;
      // } catch (error) {
      //   console.log("🚀 ~ error:", error);
      //   return false;
      // }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);

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
      console.log("🚀 ~ profile:", profile);
      console.log("🚀 ~ account:", account);

      //   try {
      //     await serverRequest(HTTP_METHODS.POST, SERVER_API_ENDPOINTS.REGISTER, {
      //       id: account?.userId,
      //       name: profile?.name,
      //       email: profile?.email,
      //     });

      //     return true;
      //   } catch (error) {
      //     return false;
      //   }
      return true;
    },
  },
};

export default NextAuth(authOptions);

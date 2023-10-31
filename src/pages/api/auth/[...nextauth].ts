import { serverRequest } from "@/lib/serverRequest";
import HTTP_METHODS from "@/utils/httpsMethods";
import SERVER_API_ENDPOINTS from "@/utils/serverApiEndpoints";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

async function refreshAccessToken(token: JWT) {
  try {
    const url =
      "https://oauth2.googleapis.com/token?" +
      new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID ?? '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      })

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.id_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.id_token;
        token.accessTokenExpires = account.expires_at;
        token.refreshToken = account.refresh_token;
        return token
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string
        session.error = token.error
      }

      return session
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};

export default NextAuth(authOptions);

"use client";

import { useScheduleStore } from "@/lib/store/schedule-store";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const PassAuthToStore = () => {
  const { setGetAccessToken } = useScheduleStore()
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    setGetAccessToken(getAccessTokenSilently)
  }, [ setGetAccessToken, getAccessTokenSilently ])

  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
      }}
    >
      <PassAuthToStore />
      {children}
    </Auth0Provider>
  );
}

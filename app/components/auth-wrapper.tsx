"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return <main>{children}</main>;
  }

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
  const redirectUri =
    typeof window !== "undefined" ? window.location.origin : "";

  if (!domain || !clientId) {
    return <main>{children}</main>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      cacheLocation="localstorage"
    >
      <main>{children}</main>
    </Auth0Provider>
  );
}

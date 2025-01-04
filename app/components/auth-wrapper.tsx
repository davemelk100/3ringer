"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return <main>{children}</main>;
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
      <main>{children}</main>
    </Auth0Provider>
  );
}

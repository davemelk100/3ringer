"use client";

import { Auth0Provider } from "@auth0/auth0-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <Auth0Provider
      domain="dev-zkebkm0eoinkzojt.us.auth0.com"
      clientId="uu8Nc2WajlANYUOwBdLvSYCyfW44AUvU"
      authorizationParams={{
        redirect_uri:
          typeof window !== "undefined" ? window.location.origin : "",
      }}
    >
      {children}
    </Auth0Provider>
  );
}

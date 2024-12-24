"use client";

import { Auth0Provider } from "@auth0/auth0-react";
import { auth0Config } from "@/lib/config/auth0";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsReady(true);
  }, []);

  const onRedirectCallback = useCallback((appState: any) => {
    router.push(appState?.returnTo || '/schedule');
  }, [router]);

  if (!isReady || typeof window === 'undefined') {
    return null;
  }

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
}
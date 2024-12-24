export const auth0Config = {
  authorizationParams: {
    redirect_uri:
      typeof window !== "undefined" ? window.location.origin + "/schedule" : "",
    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
  // Add these options to ensure you get the Auth0 Universal Login page
  appearance: {
    theme: { colorScheme: "auto" }, // or 'dark' or 'light'
  },
};

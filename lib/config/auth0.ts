export const auth0Config = {
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN!,
  clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!,
  redirectUri: typeof window !== 'undefined' 
    ? `${window.location.origin}/schedule`
    : process.env.NEXT_PUBLIC_REDIRECT_URI,
  audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
} as const;

export function validateAuth0Config() {
  const requiredEnvVars = {
    domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(`Missing required Auth0 configuration: ${missingVars.join(', ')}`);
  }
}
import { useAuth0 } from "@auth0/auth0-react";

export function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      // This ensures you get the Auth0 Universal Login page
      authorizationParams: {
        prompt: "login",
      },
    });
  };

  return (
    <button onClick={handleLogin} className="your-button-classes">
      Log In
    </button>
  );
}

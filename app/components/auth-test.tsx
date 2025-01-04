"use client";

import { useAuth0 } from "@auth0/auth0-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthTest() {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && window.location.pathname === "/") {
      router.push("/schedule");
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      {!isAuthenticated ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => loginWithRedirect()}
            style={{ padding: "10px", backgroundColor: "blue", color: "white" }}
          >
            Test Auth0 Login
          </button>
          <Link
            href="/schedule"
            style={{
              padding: "10px",
              backgroundColor: "green",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Go to Schedule
          </Link>
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
}

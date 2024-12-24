import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import LandingPage from "@/app/page";

vi.mock("@auth0/auth0-react");
vi.mock("next/navigation");

describe("Authentication", () => {
  it("shows loading state", () => {
    const mockPush = vi.fn();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });

    (useAuth0 as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    });

    render(<LandingPage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows login button when not authenticated", () => {
    const mockPush = vi.fn();
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });

    (useAuth0 as any).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      loginWithRedirect: vi.fn(),
    });

    render(<LandingPage />);
    expect(screen.getByText("Log In")).toBeInTheDocument();
  });
});

import { Auth0ContextInterface } from "@auth0/auth0-react";
import { format } from "date-fns";

const API_BASE_URL = "https://orders-gateway-250f3dmu.uc.gateway.dev";
const TOKEN_TIMEOUT = 5000; // 5 seconds timeout for token retrieval
const AUTH0_AUDIENCE = "https://davidmelkonian.com";

export class ApiClient {
  private getAccessTokenSilently: (options?: {
    authorizationParams?: { audience?: string };
  }) => Promise<string>;

  constructor(
    getAccessTokenSilently: (options?: {
      authorizationParams?: { audience?: string };
    }) => Promise<string>
  ) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  private async getHeaders(requireAuth: boolean = false): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!requireAuth) {
      return headers;
    }

    try {
      console.log("Attempting to get access token...");

      // Create a promise that rejects after timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error("Token retrieval timed out"));
        }, TOKEN_TIMEOUT);
      });

      // Race between token retrieval and timeout
      const token = await Promise.race([
        this.getAccessTokenSilently({
          authorizationParams: {
            audience: AUTH0_AUDIENCE,
          },
        }),
        timeoutPromise,
      ]);

      console.log("Successfully retrieved access token");

      if (!token) {
        throw new Error("Access token is empty");
      }

      return {
        ...headers,
        Authorization: `Bearer ${token}`,
      };
    } catch (error) {
      console.error("Error getting access token:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to get access token: ${error.message}`);
      }
      throw new Error("Failed to get access token: Unknown error");
    }
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: "cors",
        credentials: "include",
        headers: {
          ...options.headers,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
      clearTimeout(id);

      // Handle specific error cases
      if (response.status === 401) {
        throw new Error("Authentication failed - token may be expired");
      }
      if (response.status === 400) {
        const errorText = await response.text();
        throw new Error(`Bad request: ${errorText}`);
      }
      if (response.status === 404) {
        throw new Error("Resource not found");
      }

      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  async getOrders(date: Date, version?: number): Promise<any> {
    try {
      console.log("Fetching orders for date:", format(date, "yyyy-MM-dd"));
      const formattedDate = format(date, "yyyy-MM-dd");
      const headers = await this.getHeaders(false); // No auth required for reading

      const url =
        version !== undefined
          ? `${API_BASE_URL}/orders?date=${formattedDate}&v=${version}`
          : `${API_BASE_URL}/orders?date=${formattedDate}`;

      console.log("Making API request to:", url);
      console.log("Request headers:", headers);

      const response = await this.fetchWithTimeout(url, {
        method: "GET",
        headers,
      });

      console.log("API response status:", response.status);
      console.log(
        "API response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (response.status === 204) {
        console.log("No content returned from API for date:", formattedDate);
        return null;
      }

      const data = await response.json();
      console.log("Successfully fetched orders for date:", formattedDate);
      console.log("Response data:", JSON.stringify(data, null, 2));
      return data;
    } catch (error) {
      console.error(
        "Error in getOrders for date:",
        format(date, "yyyy-MM-dd"),
        error
      );
      if (error instanceof Error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
      throw error;
    }
  }

  async saveOrders(date: Date, data: any): Promise<void> {
    try {
      console.log("Saving orders for date:", format(date, "yyyy-MM-dd"));
      const formattedDate = format(date, "yyyy-MM-dd");
      const headers = await this.getHeaders(true); // Auth required for saving

      console.log(
        "Making API request to:",
        `${API_BASE_URL}/orders?date=${formattedDate}`
      );
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/orders?date=${formattedDate}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        }
      );

      console.log("API response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          `Failed to save orders: ${response.statusText} - ${errorText}`
        );
      }

      console.log("Successfully saved orders");
    } catch (error) {
      console.error("Error in saveOrders:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to save orders: ${error.message}`);
      }
      throw error;
    }
  }
}

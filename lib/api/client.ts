import { Auth0ContextInterface } from "@auth0/auth0-react";
import { format } from "date-fns";

const API_BASE_URL = "https://orders-gateway-250f3dmu.uc.gateway.dev";
const TOKEN_TIMEOUT = 5000; // 5 seconds timeout for token retrieval

export class ApiClient {
  private getAccessTokenSilently: () => Promise<string>;

  constructor(getAccessTokenSilently: () => Promise<string>) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  private async getHeaders(): Promise<HeadersInit> {
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
        this.getAccessTokenSilently(),
        timeoutPromise,
      ]);

      console.log("Successfully retrieved access token");

      if (!token) {
        throw new Error("Access token is empty");
      }

      return {
        "Content-Type": "application/json",
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
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  async getOrders(date: Date): Promise<any> {
    try {
      console.log("Fetching orders for date:", format(date, "yyyy-MM-dd"));
      const formattedDate = format(date, "yyyy-MM-dd");
      const headers = await this.getHeaders();

      console.log(
        "Making API request to:",
        `${API_BASE_URL}/orders?date=${formattedDate}`
      );
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/orders?date=${formattedDate}`,
        {
          method: "GET",
          headers,
        }
      );

      console.log("API response status:", response.status);
      if (response.status === 204) {
        console.log("No content returned from API");
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(
          `Failed to fetch orders: ${response.statusText} - ${errorText}`
        );
      }

      const data = await response.json();
      console.log("Successfully fetched orders");
      return data;
    } catch (error) {
      console.error("Error in getOrders:", error);
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
      const headers = await this.getHeaders();

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

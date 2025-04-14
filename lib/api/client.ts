import { Auth0ContextInterface } from "@auth0/auth0-react";
import { format } from "date-fns";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export class ApiClient {
  private getAccessTokenSilently: () => Promise<string>;

  constructor(getAccessTokenSilently: () => Promise<string>) {
    this.getAccessTokenSilently = getAccessTokenSilently;
  }

  private async getHeaders(): Promise<HeadersInit> {
    try {
      console.log("Attempting to get access token...");
      const token = await this.getAccessTokenSilently();
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
        `${API_BASE_URL}/orders/${formattedDate}`
      );
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/orders/${formattedDate}`,
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
        `${API_BASE_URL}/orders/${formattedDate}`
      );
      const response = await this.fetchWithTimeout(
        `${API_BASE_URL}/orders/${formattedDate}`,
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

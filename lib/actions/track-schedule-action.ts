export async function trackScheduleAction(action: {
  type: string;
  changes: {
    before: any;
    after: any;
    field: string;
    cellId?: string;
  }[];
  userId?: string;
}) {
  try {
    const response = await fetch(
      "https://us-central1-formr-442619.cloudfunctions.net/Orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...action,
          timestamp: new Date(),
        }),
      }
    );

    if (!response.ok) {
      console.error("Failed to track changes:", await response.text());
    }
  } catch (error) {
    console.error("Error tracking changes:", error);
  }
}

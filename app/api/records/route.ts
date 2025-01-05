import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { date, view } = await req.json();

    // Mock data
    const mockRecords = [
      {
        date: date,
        lastUpdated: Date.now(),
        sections: [
          {
            id: "section-1",
            title: "Carpet",
            rows: [
              { column1: "9:00 AM", column2: "Meeting", column3: "Room 101" },
              { column1: "10:00 AM", column2: "Break", column3: "Cafeteria" },
            ],
          },
          {
            id: "section-2",
            title: "Hardwood",
            rows: [
              { column1: "11:00 AM", column2: "Training", column3: "Room 102" },
              { column1: "12:00 PM", column2: "Lunch", column3: "Cafeteria" },
            ],
          },
          {
            id: "section-3",
            title: "CPU",
            rows: [
              { column1: "1:00 PM", column2: "Project", column3: "Room 103" },
              { column1: "2:00 PM", column2: "Meeting", column3: "Room 104" },
            ],
          },
        ],
      },
    ];

    if (view === "week") {
      // Add more mock data for week view
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      mockRecords.push({
        date: tomorrow.toISOString().split("T")[0],
        lastUpdated: Date.now(),
        sections: [
          {
            id: "section-1",
            title: "Carpet",
            rows: [
              { column1: "9:00 AM", column2: "Training", column3: "Room 102" },
              { column1: "10:00 AM", column2: "Project", column3: "Room 103" },
            ],
          },
          {
            id: "section-2",
            title: "Hardwood",
            rows: [
              { column1: "11:00 AM", column2: "Meeting", column3: "Room 104" },
              { column1: "12:00 PM", column2: "Break", column3: "Cafeteria" },
            ],
          },
          {
            id: "section-3",
            title: "CPU",
            rows: [
              { column1: "1:00 PM", column2: "Project", column3: "Room 105" },
              { column1: "2:00 PM", column2: "Training", column3: "Room 106" },
            ],
          },
        ],
      });
    }

    return NextResponse.json({ records: mockRecords });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch records" },
      { status: 500 }
    );
  }
}

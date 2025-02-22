import { format } from "date-fns";
import { ScheduleEvent, ScheduleSection, ScheduleState } from "../types/schedule";

type ServerSchedule = {
  Title: string,
  Rows: Record<string, string>[],
}[]

export async function saveScheduleSections(state: ScheduleState) {
  const schedule = convertState(state)

  const date = format(state.activeDay!, 'yyyy-MM-dd')

  try {
    const response = await fetch(
      `https://us-central1-formr-442619.cloudfunctions.net/Orders?date=${date}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schedule),
      }
    );

    if (!response.ok) {
      console.error("Failed to save date:", await response.text());
    }
  } catch (error) {
    console.error("Error tracking changes:", error);
  }
}

export async function loadScheduleSections(activeDay: Date): Promise<Partial<ScheduleState>> {

  const date = format(activeDay, 'yyyy-MM-dd')

  try {
    const response = await fetch(
      `https://us-central1-formr-442619.cloudfunctions.net/Orders?date=${date}`,
    );

    if (!response.ok) {
      console.error("Failed to get date:", await response.text());
    } else if (response.status != 204) {
      return convertSchedule(activeDay, await response.json())
    }
  } catch (error) {
    console.error("Error tracking changes:", error);
  }

  return {}
}

function convertState(state: ScheduleState) {
  const schedule: ServerSchedule = state.sections.map(({ title }) => ({ Title: title, Rows: [{}]}))

  const weekday = format(state.activeDay!, 'eeee')

  for (const id in state.events) {
    const { day, section, rowIndex, columnId, content } = state.events[id]

    if (day == weekday) {
      const sectionIndex = state.sections.findIndex(({ id }) => id == section)
      if (sectionIndex >= 0) {
        const row = schedule[sectionIndex].Rows[rowIndex] || {}
        row[columnId] = content
        schedule[sectionIndex].Rows[rowIndex] = row
      }
    }
  }

  return schedule
}

function convertSchedule(date: Date, schedule: ServerSchedule) {
  let sections: ScheduleSection[] = schedule.map(({ Title, Rows }) => ({
    id: Title.toLowerCase(),
    title: Title,
    rows: Rows.length,
  }))

  const day = format(date, 'eeee')

  let events: Record<string, ScheduleEvent> = {}
  schedule.forEach(({ Title, Rows }) => {
    const section = Title.toLowerCase()
    Rows.forEach((values, rowIndex) => {
      for (const columnId in values) {
        const id = `${day}-${columnId}-${section}-${rowIndex}`
        events[id] = {
          columnId,
          content: values[columnId],
          day,
          id,
          rowIndex,
          section,
        }
      }

    })
  })

  return { sections, events }
}
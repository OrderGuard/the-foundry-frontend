// utils/isRestaurantOpen.ts
type Schedule = {
  [key: number]: [string, string] | null; // open, close in "HH:mm" or null = closed
};

// Sunday = 0, Monday = 1, ..., Saturday = 6
const SCHEDULE: Schedule = {
  0: ["11:00", "15:00"], // Sunday
  1: null,               // Monday closed
  2: ["17:00", "22:00"], // Tuesday
  3: ["17:00", "22:30"], // Wednesday
  4: ["17:00", "22:30"], // Thursday
  5: ["17:00", "23:00"], // Friday
  6: ["17:00", "23:00"], // Saturday
};

// Build a Date representing the current moment in UTC (GMT)
function getGMTDate(now = new Date()): Date {
  // Get parts for the current instant in UTC
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const p: Record<string, string> = {};
  for (const { type, value } of parts) {
    if (type !== "literal") p[type] = value;
  }

  const year = Number(p.year);
  const month = Number(p.month); // 1-12
  const day = Number(p.day);
  const hour = Number(p.hour);
  const minute = Number(p.minute);
  const second = Number(p.second);

  // Create a Date at that exact UTC moment
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
}

// Parse "HH:mm" as a Date on the same UTC day as baseDate
function parseUTCtime(baseDate: Date, timeStr: string): Date {
  const [hh, mm] = timeStr.split(":").map(Number);
  // baseDate is already UTC-based (from getGMTDate)
  return new Date(Date.UTC(
    baseDate.getUTCFullYear(),
    baseDate.getUTCMonth(),
    baseDate.getUTCDate(),
    hh,
    mm,
    0,
  ));
}

// Format "HH:mm" schedule string to "h:mm AM/PM" (GMT)
function formatScheduleTo12(timeStr: string): string {
  const [hh, mm] = timeStr.split(":").map(Number);
  const d = new Date(Date.UTC(2000, 0, 1, hh, mm, 0));
  return d.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

// Format a Date to "h:mm AM/PM"
function formatDateTo12UTC(d: Date): string {
  return d.toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

function findNextOpen(currentUtcDate: Date): { nextDayName: string; nextOpenTime: string } | null {
  const currentDay = currentUtcDate.getUTCDay();
  for (let i = 0; i < 7; i++) {
    const candidateDay = (currentDay + i) % 7;
    const schedule = SCHEDULE[candidateDay];
    if (schedule && schedule[0]) {
      // compute candidate day name (use UTC day)
      const candidateDate = new Date(currentUtcDate);
      candidateDate.setUTCDate(currentUtcDate.getUTCDate() + i);
      const nextDayName = candidateDate.toLocaleDateString("en-GB", {
        weekday: "long",
        timeZone: "UTC",
      });
      return { nextDayName, nextOpenTime: formatScheduleTo12(schedule[0]) };
    }
  }
  return null;
}

export function isRestaurantOpenGMT(now = new Date()): {
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
  dayName: string;
  ukTime: string;            // formatted as "4:05 PM"
  nextOpenDay?: string;      // "today" or weekday name
  nextOpenTime?: string;     // formatted as "5:00 PM"
} {
  const utcNow = getGMTDate(now); // reliable GMT-based Date
  const weekday = utcNow.getUTCDay(); // Sunday=0
  const dayName = utcNow.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const ukTime = formatDateTo12UTC(utcNow) + " GMT";

  const schedule = SCHEDULE[weekday];

  // If no schedule for today -> closed today
  if (!schedule) {
    const next = findNextOpen(utcNow);
    if (!next) {
      return { isOpen: false, dayName, ukTime };
    }
    return {
      isOpen: false,
      dayName,
      ukTime,
      nextOpenDay: next.nextDayName,
      nextOpenTime: next.nextOpenTime,
    };
  }

  const [openStr, closeStr] = schedule; // guaranteed non-null here
  const openDt = parseUTCtime(utcNow, openStr);
  let closeDt = parseUTCtime(utcNow, closeStr);

  // If close <= open, assume overnight and push close to next UTC day
  if (closeDt <= openDt) {
    closeDt = new Date(closeDt.getTime());
    closeDt.setUTCDate(closeDt.getUTCDate() + 1);
  }

  // If currently inside open window
  if (utcNow >= openDt && utcNow < closeDt) {
    return {
      isOpen: true,
      openTime: formatScheduleTo12(openStr),
      closeTime: formatScheduleTo12(closeStr),
      dayName,
      ukTime,
    };
  }

  // Not open now. If it's before today's open -> says "today"
  if (utcNow < openDt) {
    return {
      isOpen: false,
      dayName,
      ukTime,
      nextOpenDay: "today",
      nextOpenTime: formatScheduleTo12(openStr),
    };
  }

  // Otherwise (after today's close) find next scheduled open
  const next = findNextOpen(utcNow);
  if (next) {
    return {
      isOpen: false,
      dayName,
      ukTime,
      nextOpenDay: next.nextDayName,
      nextOpenTime: next.nextOpenTime,
    };
  }

  // Fallback
  return { isOpen: false, dayName, ukTime };
}


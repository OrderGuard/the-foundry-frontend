
export type Schedule = {
  [key: number]: [string, string] | null;
};

export const SCHEDULE: Schedule = {
  0: ["11:00", "15:00"], // Sunday
  1: null,               // Monday closed
  2: ["17:00", "22:30"], // Thursday
  3: ["17:00", "22:30"], // Wednesday
  4: ["17:00", "22:30"], // Thursday
  5: ["17:00", "23:00"], // Friday
  6: ["17:00", "23:00"], // Saturday
};


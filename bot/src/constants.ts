export const Sectors = {
  Left: "Vertical Wall (Left Sector)",
  Spray: "Overhang Wall (Left Spray)",
  Board: "Overhang Wall (Right Board)",
  Right: "Slab Wall (Right Sector)",
};

export const Grades = {
  Easy: "⬜️ V1 and Below",
  Medium: "🟩 V2-V3",
  Hard: "🟦 V4-V5",
  Harder: "🟥 V6 and beyond",
  Wild: "🟪 Ungraded",
};

export const SECTORS_BUTTONS = [
  [Sectors.Left],
  [Sectors.Spray],
  [Sectors.Board],
  [Sectors.Right],
];

export const GRADES_BUTTONS = [
  [Grades.Easy, Grades.Medium],
  [Grades.Hard, Grades.Harder],
  [Grades.Wild],
];

export const WORKSHEET_SUBMISSIONS = "submissions";
export const WORKSHEET_REPORTS = "reports";
export const WORKSHEET_FEEDBACKS = "feedbacks";
export const WORKSHEET_TEST = "test";

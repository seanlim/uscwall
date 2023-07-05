export const WELCOME_MESSAGE = `
*Welcome to USCTelebot\\!*

We've phased out viewing routes on Telegram\\. Visit [this website](https://apps.sean.place/uscwall) to view routes and log ascents\\.

*Use /submit to submit a route\\!*
`;

export const SUBMIT_MESSAGE = `
*Route Submission Instructions*

Submissions will be vetted based on the following guidelines:
 \\- Be upright\\.
 \\- Be properly cropped\\.
 \\- Be of good quality\\.
 \\- Contain start and top holds that are clearly marked out\\.
 \\- Have footholds that are distinguished from handholds\\.

Here is a [Reference route](https://i.imgur.com/pQDIPGu.webp?maxwidth=1500&shape=thumb&fidelity=high)\\.

/cancel to cancel submission\\.

To begin, please attach an image of your proposed route:
`;

export const Sectors = {
  Vertical: "Sector 1 (Vertical)",
  Overhang: "Sector 2 (23° Overhang)",
  Slab: "Sector 3 (Slab)",
  Board: "Board Sector",
};

export const SECTORS_BUTTONS = [
  [Sectors.Vertical, Sectors.Overhang],
  [Sectors.Slab, Sectors.Board],
];

export const Grades = {
  Easy: "⬜️ (V0-V1)",
  Medium: "🟩 (V2-V3)",
  Hard: "🟦 (V4-V5)",
  Harder: "🟥 (≥V5)",
};

export const GRADES_BUTTONS = [
  [Grades.Easy, Grades.Medium],
  [Grades.Hard, Grades.Harder],
];

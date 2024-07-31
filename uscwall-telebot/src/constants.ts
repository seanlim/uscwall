// export const WELCOME_MESSAGE = `
// *Welcome to the USCTelebot\\!*

// To see climbing routes\\, please launch the [Route Explorer](https://t.me/USCTelebot/uscwall)\\.

// *Commands\\:*
// \\- /submit to submit a route\\.
// \\- /report to report issues with the boulder wall\\.
// \\- /feedback to submit feedback\\.
// `;

// export const SUBMIT_MESSAGE = `
// *Route Submission Instructions*

// Submissions will be vetted based on the following guidelines:
//  \\- Be upright\\.
//  \\- Be properly cropped\\.
//  \\- Be of good quality\\.
//  \\- Contain start and top holds that are clearly marked out\\.
//  \\- Have footholds that are distinguished from handholds\\.

// Here is a [Reference route](https://i.imgur.com/pQDIPGu.webp?maxwidth=1500&shape=thumb&fidelity=high)\\.

// To begin, please attach an image of your proposed route\\.

// You can use /cancel to cancel your submission at any point\\.
// `;

export const Sectors = {
  Left: "Left Sector (Vertical Wall)",
  Middle: "Middle Sector (Overhang Wall)",
  Right: "Right Sector (Slab Wall)",
};

export const SECTORS_BUTTONS = [
  [Sectors.Left, Sectors.Middle],
  [Sectors.Right],
];

export const Grades = {
  Easy: "⬜️ Beginner (V0-V1)",
  Medium: "🟩 Easy (V2-V3)",
  Hard: "🟦 Intermediate (V4-V5)",
  Harder: "🟥 Hard (≥V5)",
};

export const GRADES_BUTTONS = [
  [Grades.Easy, Grades.Medium],
  [Grades.Hard, Grades.Harder],
];

export const WORKSHEET_SUBMISSIONS = "submissions";
export const WORKSHEET_REPORTS = "reports";
export const WORKSHEET_FEEDBACKS = "feedbacks";
export const WORKSHEET_TEST = "test";

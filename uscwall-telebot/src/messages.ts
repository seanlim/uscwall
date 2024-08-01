const ROUTE_EXPLORER_URL = "https://t.me/USCTelebot/uscwall";

const messages = {
  welcomeInstructions: `
*Welcome to the USC Telegram Bot\\!*

To see climbing routes\\, please launch the [Route Explorer](${ROUTE_EXPLORER_URL})\\.

*Commands\\:*
\\- /submit to submit a route\\.
\\- /report to report issues with the boulder wall\\.
\\- /feedback to submit feedback\\.
  `,
  submit: {
    instructions: `
*Route Submission Instructions*

Submissions will be vetted based on the following guidelines:
 \\- Be upright\\.
 \\- Be properly cropped\\.
 \\- Be of good quality\\.
 \\- Contain start and top holds that are clearly marked out\\.
 \\- Have footholds that are distinguished from handholds\\.

Here is a [Reference route](https://i.imgur.com/pQDIPGu.webp?maxwidth=1500&shape=thumb&fidelity=high)\\.

To begin, please attach an image of your proposed route\\.

You can use /cancel to cancel your submission at any point\\.
    `,
  },
  feedback: {
    instructions: `*Submit Feedback*\nTo cancel your submission\\, use /cancel\\.\nPlease send your feedback in one message\\:`,
  },
  report: {
    instructions: `*Report Issue*\nTo cancel your report\\, use /cancel\\.\nPlease give a detailed description of the issue\\:`,
  },
  invalid: {
    useInputsProvided: `Invalid input, please use inputs provided`,
    uploadImage: `Invalid file, please send an image file.`,
  },
  error: {
    internalError: [
      `Apologies, something appears to have went wrong.`,
      `We are working to resolve the issue, in the meantime feel free to try again!`,
    ],
  },
};

export default messages;

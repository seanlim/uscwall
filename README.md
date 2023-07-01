# Website and Telegam Bot for the NUS USC Boulder Wall

This repo contains:

- `uscwall-telebot`: web server that hosts telegram bot and main APIs
- `uscwall-web`: mobile-friendly website for browsing routes

# Roadmap

- Set up Telegram Bot and main API applications on server.
- Migrate main Google Sheets client to the server-side.
  - figure out how to cache Sheets API calls otherwise the server might be slow.
- Build new Telegram Bot
  - /submit-route : submit routes for vetting
  - /view-routes : redirects to website
- Deploy new Telegram Bot
- Update website:
  - Remove edge function and use API instead.
  - Add telegram bot link and allow users to create routes.
- Add support for logging ascents
  - Add "Sign in with Telegram" capability to the server side.
  - Add API endpoint for logging ascent (must be authenticated, unsure about the protocol here).
  - Add "Sign in with Telegram" capability to website.
  - Add button to log ascent.
  - Add Ascentionist list to route viewer.
- Add API endpoint to retrieve users logbook.

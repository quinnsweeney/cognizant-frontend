# Cognizant

- Deployed URL: https://cognizant-frontend-sigma.vercel.app/
- Clone and run locally:
  - `bun install`
  - `bun start`
- Backend repo: https://github.com/quinnsweeney/cognizant-backend

## Notes

I created a backend for security reasons, as I didn't want to expose my Gemini API key. I chose to use Gemini because they have a free tier that I could easily implement, and I enjoy Google's API documentation over other LLM APIs. If you make more than 100 requests in 15 mins, you will be rate limited.

## Features

Uses json compression to save state to localstorage, loading chats on refresh. This does not, however, presist sessions, it just loads your chat history and starts a new session with a fresh context window. Session persistence is outside the scope of this project.

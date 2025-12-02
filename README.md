# MyDataHub Landing Site

We decided to separate the marketing site from the main application to keep things clean and focused. This directory contains everything needed to showcase MyDataHub without the complexity of the full app.

## What's here

- **Landing page**: The main demo experience that shows off what MyDataHub can do
- **Team showcase**: Meet the people behind MyDataHub
- **Clean setup**: Just the essentials - no backend complexity

## Why we split this out

Originally everything was together, but we realized the marketing site has different needs:
- Faster loading for first-time visitors
- Simpler deployment and updates
- Focus on storytelling vs functionality
- Independent development cycles

## Running locally

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`.

## What you'll see

The demo shows our chat interface, team profiles, and overall vision for identity verification. It's designed to give people a feel for the product without needing to sign up or authenticate.

## Full app

If you want to see the complete application with user accounts, real chat functionality, and all the backend integrations, check out the `App/` directory instead. 

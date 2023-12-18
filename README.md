# OpenMailer [work in progress]

A minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc...

## Features

- creation of multiple email lists

- a POST endpoint for subscribing

- double opt-in and unsubscribe logic

- sending plain HTML campaigns

- click & open rate tracking per campaing & subscriber

- click statistics for links

## Setup

1. Create a MongoDB database. Your database user should have Admin permissions.

2. Install dependencies with `npm i` or `yarn`

3. Copy `.env.dist` to `.env.local` and add the configuration

4. Run locally with `npm run dev`. To run the production version use `npm run build` and `npm run start`.


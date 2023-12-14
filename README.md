# OpenMailer [work in progress]

A minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc...

## Features

- a POST endpoint for subscribing

- double opt-in and unsubscribe logic

- sending plain HTML campaigns

- click & open rate tracking per campaing & subscriber

- click statistics for links

## Setup

1. Create a MongoDB database. Your database user should have Admin permissions.

2. Install dependencies with `npm i` or `yarn`

3. Copy `.env.dist` to `.env.local` and add configuration

4. Run with `npm run dev`

## Customize

Update the welcome template in `/lib/templates/welcome`


<div align="center">

<img src="https://github.com/Vincenius/OpenMailer/assets/43953403/f4c5f1ce-6ef5-4ab7-9569-8778d2990980" width="300" alt="OpenMailer logo">

<h3><em>OpenMailer is a minimalist Next.js alternative to Mailchimp, Beehiiv, Convertkit etc...</em></h3>
<p>
<img src="https://img.shields.io/github/contributors/Vincenius/OpenMailer?style=plastic" alt="Contributors">
<img src="https://img.shields.io/github/forks/Vincenius/OpenMailer" alt="Forks">
<img src="https://img.shields.io/github/stars/Vincenius/OpenMailer" alt="Stars">
<img src="https://img.shields.io/github/license/Vincenius/OpenMailer?" alt="Licence">
<img src="https://img.shields.io/github/issues/Vincenius/OpenMailer" alt="Issues">
<img src="https://img.shields.io/github/languages/count/Vincenius/OpenMailer" alt="Languages">
<img src="https://img.shields.io/github/repo-size/Vincenius/OpenMailer" alt="Repository Size">
</p>

<img src="https://github.com/Vincenius/OpenMailer/assets/43953403/5a2f25db-ab5b-4e85-9ee0-b502d6479a65" alt="Screenshots of different pages of OpenMailer">
</div>

## Features

- creation of multiple email lists

- a POST endpoint for subscribing

- import functionality for subscribers

- double opt-in and unsubscribe logic

- sending plain HTML campaigns

- click & open rate tracking per campaing & subscriber

- click statistics for links

## Setup

*Disclaimer: Hosting on Vercel does not work properly at the moment because of long running background tasks*

1. Create a MongoDB database. Your database user should have admin permissions.

2. Install dependencies with `npm i` or `yarn`

3. Copy `.env.dist` to `.env.local` and update the configuration

4. Run locally with `npm run dev`. To run the production version use `npm run build` and `npm run start`.

## License

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

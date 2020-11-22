[![Voicybot](/img/logo.png?raw=true)](http://voicybot.com/)

# Fork of [voicybot](https://github.com/backmeupplz/voicy) with various changes

I mainly refactored the code a bit, upgraded the dependencies, dealt with deprecated stuff and overall made the bot more general use without any promo or ads.

# Installation and local launch

1. Clone this repo: `git clone https://github.com/saschanockel/voicy`
2. Launch the [mongo database](https://www.mongodb.com/) locally or use docker for it
3. Create `.env` file with the environment variables listed below
4. Install ffmpeg on your machine
5. Run `yarn install` in the root folder
6. Run `yarn start`

# Environment variables in `.env` file

- `MONGO_URL` — Url for the mongo database used
- `TOKEN` — Your telegram bot token
- `ADMIN_ID` — Chat id of the person who shall receive valuable logs
- `WIT_LANGUAGES` — A map of language names to Wit.ai tokens
- `UPDATES_LOG_DIR` Path where the updates.log should be stored in the style of your OS e.g. on Windows C:\\\logs, if not set the file will be located in the app directory
- `USE_WEBHOOK` — Use a Webhook or not (true/false), leave empty if not using a webhook
- `WEBHOOK_DOMAIN` — Use this domain when using a webhook, else can be left empty

Extra info is available in `.env.sample` file.

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers and maybe also me :). Thanks!

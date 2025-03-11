## Overview
This project is a Node.js application written in TypeScript that fetches data from the Wildberries API, stores it in a PostgreSQL database using Knex.js, and exports the data to Google Sheets. The application runs in a Docker container and includes a cron job for periodic(1 hour) data fetching.


## Features
 .Fetches data from the Wildberries API.
 .Saves data to a PostgreSQL database.
 .Exports data to Google Sheets.
 .Uses node-cron to schedule periodic updates.
 .Runs inside Docker with docker compose up.


## All configuration you can find:
- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts


## Commands:
Starting the database:
```bash
docker compose up -d --build postgres
```

To perform migrations and seeds not from a container:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```

Launching a test of the application itself:
```bash
docker compose up -d --build app
```

For the final check I recommend:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```


## Running the Application:
For development:
```bash or ...
  npm run dev
```

To run the application in production mode:
```bash or ...
  docker compose up
```

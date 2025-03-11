import { migrate, seed } from "#postgres/knex.js";
import { getAndUpdateTariffs } from "#services/wbDataService.js";
import { startCronJob } from "#utils/cron.js";

await migrate.latest();
await seed.run();
startCronJob(getAndUpdateTariffs);

console.log("All migrations and seeds have been run");
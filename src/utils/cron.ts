import cron from "node-cron";

export function startCronJob(func: Function): void {
    cron.schedule("0 * * * *", () => {
        console.log("Running cron job");
        func();
    });
}
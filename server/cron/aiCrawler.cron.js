import cron from "node-cron";
import { runAICrawler } from "../services/aiCrawler.service.js";

// ─────────────────────────────────────────────────────────────
// AI Data Collection Cron Job
// ─────────────────────────────────────────────────────────────
// Schedule: Every 5 days at Midnight (00:00)
// Cron Expression: "0 0 */5 * *" 
// This schedule automatically runs based on the calendar date (every 5th day),
// ensuring it persists predictably across server restarts without drifting.

export function initCronJobs() {
  console.log("⏰ Initializing Cron Jobs: AI Crawler scheduled for every 5 days (0 0 */5 * *)");

  cron.schedule("0 0 */5 * *", async () => {
    console.log(`\n[CRON] Executing scheduled AI Crawler Job - ${new Date().toISOString()}`);
    await runAICrawler();
  });
}

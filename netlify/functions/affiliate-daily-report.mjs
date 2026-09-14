import { getStore } from "@netlify/blobs";
import { AFFILIATE_STORE } from "../../lib/affiliate-events.mjs";
import { REPORT_STORE, saveDailyReport, removeExpiredReports } from "../../lib/affiliate-reporting.mjs";

export function createReportHandler(openStore = getStore) {
  return async (_request, context) => {
    if (context?.deploy?.context !== "production") return;
    const deadline = Date.now() + 25000;
    try {
      const reports = openStore(REPORT_STORE);
      // Clean old aggregate records before publishing a fresh snapshot.
      await removeExpiredReports(reports, new Date(), { deadline: deadline - 4000 });
      await saveDailyReport(openStore({ name: AFFILIATE_STORE, consistency: "strong" }), reports, new Date(), { deadline });
      console.info("Private affiliate report saved successfully");
    } catch {
      console.error("Affiliate report job did not complete; inspect the private report timestamp before use");
      throw new Error("Affiliate report failed; inspect private storage and retry.");
    }
  };
}

export default createReportHandler();
export const config = { schedule: "7 5 * * *" };

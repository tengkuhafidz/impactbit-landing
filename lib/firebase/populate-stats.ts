/**
 * Script to populate Firestore with campaign stats
 * Run this script to sync your local campaign stats to Firestore
 *
 * Usage: npx tsx lib/firebase/populate-stats.ts
 */

import { db } from "./config"
import { doc, setDoc } from "firebase/firestore"
import { campaignStats } from "@/content/campaignStats"

async function populateCampaignStats() {
  console.log("Starting to populate Firestore with campaign stats...")

  try {
    for (const [campaignId, stats] of Object.entries(campaignStats)) {
      console.log(`\nPopulating stats for campaign: ${campaignId}`)
      console.log(`  Total Impact Units: ${stats.totalImpactUnits}`)

      const campaignStatsRef = doc(db, "campaignStats", campaignId)

      await setDoc(campaignStatsRef, {
        totalUnitImpact: stats.totalImpactUnits,
        totalDonation: 0, // You can update this with actual values
        totalDonors: 0, // You can update this with actual values
        lastUpdated: new Date(),
      })

      console.log(`  ✓ Successfully populated stats for ${campaignId}`)
    }

    console.log("\n✓ All campaign stats have been populated successfully!")
    console.log("\nNext steps:")
    console.log("1. Verify the data in your Firestore console")
    console.log("2. You can now remove the fallback mechanism in lib/sanity/queries.ts if desired")
    console.log("3. Update the stats in Firestore as your campaigns grow")
  } catch (error) {
    console.error("\n✗ Error populating campaign stats:", error)
    process.exit(1)
  }
}

// Run the script
populateCampaignStats()
  .then(() => {
    console.log("\nScript completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\nScript failed:", error)
    process.exit(1)
  })

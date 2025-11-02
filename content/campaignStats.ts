/**
 * Campaign statistics that are updated dynamically
 * These are kept separate from Sanity CMS for easy updates
 */

export interface CampaignStats {
  totalImpactUnits: number
}

type CampaignStatsMap = Record<string, CampaignStats>

export const campaignStats: CampaignStatsMap = {
  "quranbit": {
    totalImpactUnits: 194964
  },
  "community-pantry": {
    totalImpactUnits: 20043
  },
  "infaq-friday": {
    totalImpactUnits: 83363
  }
}

/**
 * Get stats for a specific campaign
 * @param campaignId - The campaign ID
 * @returns Campaign stats or default values if not found
 */
export function getCampaignStats(campaignId: string): CampaignStats {
  return campaignStats[campaignId] || { totalImpactUnits: 0 }
}

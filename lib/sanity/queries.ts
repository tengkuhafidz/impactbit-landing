import { client } from "@/sanity/lib/client"
import { urlFor } from "@/sanity/lib/image"
import { getCampaignStats } from "@/content/campaignStats"
import type { Campaign, SanityCampaignRaw } from "./types"

/**
 * GROQ query to fetch a campaign with populated organisation
 */
const CAMPAIGN_QUERY = `*[_type == "campaign" && id.current == $id][0]{
  _id,
  "id": id.current,
  title,
  description,
  impactDescription,
  impactItem,
  impactPrompt,
  unitPrice,
  iconPath,
  url,
  unitImpact,
  isFullySponsored,
  isFeatured,
  oneTimeUrl,
  organisation->{
    _id,
    "id": id.current,
    name,
    description,
    website,
    logo,
    contactEmail,
    address
  },
  impactPromptAlt,
  impactOptions
}`

/**
 * GROQ query to fetch all campaigns with populated organisations
 */
const ALL_CAMPAIGNS_QUERY = `*[_type == "campaign"]{
  _id,
  "id": id.current,
  title,
  description,
  impactDescription,
  impactItem,
  impactPrompt,
  unitPrice,
  iconPath,
  url,
  unitImpact,
  isFullySponsored,
  isFeatured,
  oneTimeUrl,
  organisation->{
    _id,
    "id": id.current,
    name,
    description,
    website,
    logo,
    contactEmail,
    address
  },
  impactPromptAlt,
  impactOptions
}`

/**
 * Transform raw Sanity campaign data into the Campaign type used by the app
 */
function transformCampaign(rawCampaign: SanityCampaignRaw): Campaign {
  // Convert Sanity image object to URL string
  const iconUrl = rawCampaign.iconPath
    ? urlFor(rawCampaign.iconPath).width(200).height(200).url()
    : ""

  // Get stats from local config
  const stats = getCampaignStats(rawCampaign.id)

  return {
    id: rawCampaign.id,
    title: rawCampaign.title,
    description: rawCampaign.description,
    impactDescription: rawCampaign.impactDescription,
    impactItem: rawCampaign.impactItem,
    impactPrompt: rawCampaign.impactPrompt,
    unitPrice: rawCampaign.unitPrice,
    iconPath: iconUrl,
    url: rawCampaign.url,
    unitImpact: rawCampaign.unitImpact,
    isFullySponsored: rawCampaign.isFullySponsored,
    isFeatured: rawCampaign.isFeatured,
    oneTimeUrl: rawCampaign.oneTimeUrl,
    organisationId: rawCampaign.organisation?.id || "",
    organisationName: rawCampaign.organisation?.name,
    impactPromptAlt: rawCampaign.impactPromptAlt,
    totalImpactUnits: stats.totalImpactUnits,
    impactOptions: rawCampaign.impactOptions || []
  }
}

/**
 * Fetch a single campaign by ID from Sanity
 * @param id - The campaign ID (e.g., "quranbit", "community-pantry")
 * @returns Campaign data or null if not found
 */
export async function getCampaign(id: string): Promise<Campaign | null> {
  try {
    const rawCampaign = await client.fetch<SanityCampaignRaw>(
      CAMPAIGN_QUERY,
      { id },
      {
        // Revalidate every 60 seconds
        next: { revalidate: 60 }
      }
    )

    if (!rawCampaign) {
      return null
    }

    return transformCampaign(rawCampaign)
  } catch (error) {
    console.error(`Error fetching campaign ${id}:`, error)
    return null // Return null on error, will fallback to mockCampaigns
  }
}

/**
 * Fetch all campaigns from Sanity
 * @returns Array of Campaign data
 */
export async function getAllCampaigns(): Promise<Campaign[]> {
  try {
    const rawCampaigns = await client.fetch<SanityCampaignRaw[]>(
      ALL_CAMPAIGNS_QUERY,
      {},
      {
        // Revalidate every 60 seconds
        next: { revalidate: 60 }
      }
    )

    return rawCampaigns.map(transformCampaign)
  } catch (error) {
    console.error("Error fetching all campaigns:", error)
    return []
  }
}

/**
 * Get all campaign IDs for static generation
 * @returns Array of campaign IDs
 */
export async function getAllCampaignIds(): Promise<string[]> {
  try {
    const campaigns = await client.fetch<{ id: string }[]>(
      `*[_type == "campaign"]{ "id": id.current }`,
      {},
      {
        next: { revalidate: 3600 } // Revalidate every hour
      }
    )

    return campaigns.map(c => c.id)
  } catch (error) {
    console.error("Error fetching campaign IDs:", error)
    return []
  }
}

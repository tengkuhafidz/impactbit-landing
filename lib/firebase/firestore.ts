import { db } from "./config"
import { collection, doc, getDoc, query, orderBy, limit, getDocs, where } from "firebase/firestore"

export interface FirestoreCampaignStats {
  lastUpdated: Date
  totalDonation: number
  totalDonors: number
  totalUnitImpact: number
}

export interface FirestoreSubscription {
  campaignId: string
  cancelledAt?: Date
  createdAt: Date
  email: string
  isActive: boolean
  lastSuccessfulQiscusMessage?: Date
  lastSuccessfulStripePayment?: Date
  name: string
  numOfMonths: number
  organisationId: string
  phone: string
  quantity: number
  stripeCustomerId: string
  stripeSubscriptionId: string
  unitImpact: number
  unitPrice: number
  updatedAt: Date
}

export interface Enabler {
  name: string
  amount: number
  impactUnits: number
  date: Date
  isActive: boolean
}

/**
 * Fetch campaign statistics from Firestore
 * @param campaignId - The campaign ID (e.g., "quranbit", "community-pantry", "infaq-friday")
 * @returns Campaign stats from Firestore or default values if not found
 */
export async function getCampaignStatsFromFirestore(
  campaignId: string
): Promise<FirestoreCampaignStats> {
  try {
    console.log(`[Firestore] Fetching stats for campaign: ${campaignId}`)
    const campaignStatsRef = doc(db, "campaignStats", campaignId)
    const campaignStatsSnap = await getDoc(campaignStatsRef)

    if (campaignStatsSnap.exists()) {
      const data = campaignStatsSnap.data()
      console.log(`[Firestore] Document found for ${campaignId}:`, data)
      return {
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        totalDonation: data.totalDonation || 0,
        totalDonors: data.totalDonors || 0,
        totalUnitImpact: data.totalUnitImpact || 0,
      }
    } else {
      console.warn(`[Firestore] Campaign stats not found for: ${campaignId}`)
      console.warn(`[Firestore] Make sure the document exists at: campaignStats/${campaignId}`)
      return {
        lastUpdated: new Date(),
        totalDonation: 0,
        totalDonors: 0,
        totalUnitImpact: 0,
      }
    }
  } catch (error) {
    console.error(`[Firestore] Error fetching campaign stats for ${campaignId}:`, error)
    return {
      lastUpdated: new Date(),
      totalDonation: 0,
      totalDonors: 0,
      totalUnitImpact: 0,
    }
  }
}

/**
 * Fetch recent enablers (subscribers) from Firestore
 * @param campaignId - The campaign ID to filter by (optional, fetches all if not provided)
 * @param limitCount - Number of recent enablers to fetch (default: 10)
 * @returns Array of recent enablers ordered by updatedAt
 */
export async function getRecentEnablersFromFirestore(
  campaignId?: string,
  limitCount: number = 5
): Promise<Enabler[]> {
  try {
    console.log(`[Firestore] Fetching recent enablers${campaignId ? ` for campaign: ${campaignId}` : ''}`)
    console.log(`[Firestore] Limit: ${limitCount}`)

    const subscriptionsRef = collection(db, "subscriptions")

    // Build query with optional campaign filter
    let q = query(
      subscriptionsRef,
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    )

    // Add campaign filter if provided
    if (campaignId) {
      console.log(`[Firestore] Adding campaignId filter: ${campaignId}`)
      q = query(
        subscriptionsRef,
        where("campaignId", "==", campaignId),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      )
    }

    console.log(`[Firestore] Executing query...`)
    const querySnapshot = await getDocs(q)
    console.log(`[Firestore] Query returned ${querySnapshot.size} documents`)

    const enablers: Enabler[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      console.log(`[Firestore] Processing document ${doc.id}:`, {
        name: data.name,
        campaignId: data.campaignId,
        unitPrice: data.unitPrice,
        quantity: data.quantity,
        isActive: data.isActive,
        updatedAt: data.updatedAt
      })
      enablers.push({
        name: data.name || "Anonymous",
        amount: (data.unitPrice || 0) * (data.quantity || 1),
        date: data.updatedAt?.toDate() || new Date(),
        isActive: data.isActive || false,
        impactUnits: data.unitImpact * data.quantity || 0
      })
    })

    console.log(`[Firestore] Successfully processed ${enablers.length} enablers`)
    return enablers
  } catch (error) {
    console.error(`[Firestore] Error fetching recent enablers:`, error)
    if (error instanceof Error) {
      console.error(`[Firestore] Error name: ${error.name}`)
      console.error(`[Firestore] Error message: ${error.message}`)
      console.error(`[Firestore] Error stack:`, error.stack)
    }
    return []
  }
}

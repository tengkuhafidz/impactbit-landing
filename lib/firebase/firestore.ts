import { db } from "./config"
import { collection, doc, getDoc, query, orderBy, limit, getDocs, where } from "firebase/firestore"

export interface FirestoreCampaignStats {
  lastUpdated: Date
  totalDonation: number
  totalDonors: number
  totalUnitImpact: number
  totalAdvocates?: number
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
  referrals?: number
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
    const campaignStatsRef = doc(db, "campaignStats", campaignId)
    const campaignStatsSnap = await getDoc(campaignStatsRef)

    if (campaignStatsSnap.exists()) {
      const data = campaignStatsSnap.data()
      return {
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        totalDonation: data.totalDonation || 0,
        totalDonors: data.totalDonors || 0,
        totalUnitImpact: data.totalUnitImpact || 0,
      }
    } else {
      return {
        lastUpdated: new Date(),
        totalDonation: 0,
        totalDonors: 0,
        totalUnitImpact: 0,
      }
    }
  } catch (error) {
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
    const subscriptionsRef = collection(db, "subscriptions")

    // Build query with optional campaign filter
    let q = query(
      subscriptionsRef,
      orderBy("updatedAt", "desc"),
      limit(limitCount)
    )

    // Add campaign filter if provided
    if (campaignId) {
      q = query(
        subscriptionsRef,
        where("campaignId", "==", campaignId),
        orderBy("updatedAt", "desc"),
        limit(limitCount)
      )
    }

    const querySnapshot = await getDocs(q)

    const enablers: Enabler[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      enablers.push({
        name: data.name || "Anonymous",
        amount: (data.unitPrice || 0) * (data.quantity || 1),
        date: data.updatedAt?.toDate() || new Date(),
        isActive: data.isActive || false,
        impactUnits: data.unitImpact * data.quantity || 0
      })
    })

    return enablers
  } catch (error) {
    return []
  }
}

/**
 * Fetch overall statistics from Firestore (efficient - single document read)
 * Reads from campaignStats/overall which contains pre-aggregated stats
 * @returns Overall stats including total donors (impact creators) and advocates
 */
export async function getOverallStatsFromFirestore(): Promise<FirestoreCampaignStats> {
  try {
    const overallStatsRef = doc(db, "campaignStats", "overall")
    const overallStatsSnap = await getDoc(overallStatsRef)

    if (overallStatsSnap.exists()) {
      const data = overallStatsSnap.data()
      return {
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
        totalDonation: data.totalDonation || 0,
        totalDonors: data.totalDonors || 0,
        totalUnitImpact: data.totalUnitImpact || 0,
        totalAdvocates: data.totalAdvocates || 0,
      }
    } else {
      return {
        lastUpdated: new Date(),
        totalDonation: 0,
        totalDonors: 0,
        totalUnitImpact: 0,
        totalAdvocates: 0,
      }
    }
  } catch (error) {
    return {
      lastUpdated: new Date(),
      totalDonation: 0,
      totalDonors: 0,
      totalUnitImpact: 0,
      totalAdvocates: 0,
    }
  }
}

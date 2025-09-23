export interface MockCampaign {
    id: string
    title: string
    description: string
    impactDescription: string
    impactItem: string
    impactPrompt: string
    unitPrice: number
    iconPath: string
    url: string
    unitImpact: number
    isFullySponsored?: boolean
    isFeatured?: boolean
    oneTimeUrl?: string
    organisationId: string
    organisationName?: string
    impactPromptAlt?: string
    totalImpactUnits: number
}

const quranbit: MockCampaign = {
    id: "quranbit",
    title: "QuranBit",
    description: "Gain rewards for every letter recited daily by thousands of students worldwide.",
    impactDescription: "1 lesson comprises a 5-7 minutes personalised Iqra' or Quran lesson conducted by certified Asatizah",
    impactItem: "Quranbit Lesson",
    impactPrompt: "enabling",
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/949c28cef14da941e0afd6d7d8713077e9978f12-4500x4500.webp",
    url: "https://quranbit.waktanjong.org/",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "📖 Enabled",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 12000,
}

const communityPantry: MockCampaign = {
    id: "community-pantry",
    title: "Community Pantry",
    description: "Gain rewards for every hungry stomach fed through our free-for-all pantry.",
    impactDescription: "1 pantry item comprises a daily necessity food item such as bread, cooking oil, sugar, milk, etc",
    impactItem: "Pantry Item",
    impactPrompt: "contributing",
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/1a059008fe5ac3b7149dc5102ab10ee126f5b3d3-4500x4501.webp",
    url: "https://impacthive.waktanjong.org/collections/community-pantry",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "🛒 Contributed",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 9000,
}

const freeFoodFoward: MockCampaign = {
    id: "infaq-friday",
    title: "Free Food Forward",
    description: "Gain rewards by providing free meals on Friday to mosque congregants and low-income families in the community.",
    impactDescription: "1 food packet comprises a complete meal to be distributed to the hungry around Singapore",
    impactItem: "Food Packet",
    impactPrompt: "sponsoring",
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/84b921cf28a06a0f507e4573b7a4fffb2c31ffd2-4501x4501.webp",
    url: "https://impacthive.waktanjong.org/collections/infaq-friday",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "🍱 Sponsored",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 24000,
}

type MockCampaigns = Record<string, MockCampaign>;

const mockCampaigns: MockCampaigns = {quranbit, "community-pantry": communityPantry, "infaq-friday": freeFoodFoward}

export default mockCampaigns;
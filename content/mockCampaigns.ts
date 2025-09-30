export interface ImpactOption {
    label: string
    units: number
    description?: string
    isDefault?: boolean
}

interface LanguageTense {
    present: string
    continuous: string
    past: string
}

export interface MockCampaign {
    id: string
    title: string
    description: string
    impactDescription: string
    impactItem: string
    impactPrompt: LanguageTense
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
    impactOptions: ImpactOption[]
}

const quranbit: MockCampaign = {
    id: "quranbit",
    title: "Quranbit",
    description: "Gain rewards for every letter recited daily by thousands of students worldwide.",
    impactDescription: "1 lesson comprises a 5-7 minutes personalised Iqra' or Quran lesson conducted by certified Asatizah",
    impactItem: "Quranbit Lesson",
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/949c28cef14da941e0afd6d7d8713077e9978f12-4500x4500.webp",
    url: "https://quranbit.waktanjong.org/",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "📖 Enabled",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 194964, // not to include in Sanity
    impactOptions: [
        {
            label: "1 lesson",
            units: 1,
            isDefault: true
        },
        {
            label: "1 week of lessons",
            units: 7
        },
        {
            label: "1 month of lessons",
            units: 30
        }
    ],
    impactPrompt: {
        present: "enable",
        continuous: "enabling",
        past: "enabled"
    }
}

const communityPantry: MockCampaign = {
    id: "community-pantry",
    title: "Community Pantry",
    description: "Gain rewards for every hungry stomach fed through our free-for-all pantry.",
    impactDescription: "1 pantry item comprises a daily necessity food item such as bread, cooking oil, sugar, milk, etc",
    impactItem: "Pantry Item",
    impactPrompt: {
        present: "contribute",
        continuous: "contributing",
        past: "contributed"
    },
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/1a059008fe5ac3b7149dc5102ab10ee126f5b3d3-4500x4501.webp",
    url: "https://impacthive.waktanjong.org/collections/community-pantry",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "🛒 Contributed",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 20043,
    impactOptions: [
        {
            label: "1 pantry item",
            units: 1,
            isDefault: true
        },
        {
            label: "5 pantry items",
            units: 5
        },
        {
            label: "10 pantry items",
            units: 10
        }
    ]
}

const freeFoodFoward: MockCampaign = {
    id: "infaq-friday",
    title: "Free Food Forward",
    description: "Gain rewards by providing free meals on Friday to mosque congregants and low-income families in the community.",
    impactDescription: "1 food packet comprises a complete meal to be distributed to the hungry around Singapore",
    impactItem: "Food Packet",
    impactPrompt: {
        present: "sponsor",
        continuous: "sponsoring",
        past: "sponsored"
    },
    unitPrice: 4,
    iconPath: "https://cdn.sanity.io/images/fwb68znb/production/84b921cf28a06a0f507e4573b7a4fffb2c31ffd2-4501x4501.webp",
    url: "https://impacthive.waktanjong.org/collections/infaq-friday",
    unitImpact: 1,
    organisationId: "waktanjong-mosque",
    organisationName: "Masjid Wak Tanjong",
    impactPromptAlt: "🍱 Sponsored",
    isFullySponsored: false,
    isFeatured: true,
    totalImpactUnits: 83363,
    impactOptions: [
        {
            label: "1 food packet",
            units: 1,
            isDefault: true
        },
        {
            label: "1 family",
            units: 5,
            description: "5 food packets"
        },
        {
            label: "3 families",
            units: 15,
            description: "15 food packets"
        },
        {
            label: "10 families",
            units: 50,
            description: "50 food packets"
        }
    ]
}

type MockCampaigns = Record<string, MockCampaign>;

const mockCampaigns: MockCampaigns = { quranbit, "community-pantry": communityPantry, "infaq-friday": freeFoodFoward }

export default mockCampaigns;
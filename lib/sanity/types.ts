import { SanityImageSource } from "@sanity/image-url/lib/types/types"

// Base types matching Sanity schema
export interface SanityImpactOption {
  label: string
  units: number
  description?: string
  isDefault?: boolean
}

export interface SanityImpactPrompt {
  present: string
  continuous: string
  past: string
  noun: string
}

export interface SanityOrganisation {
  _id: string
  id: string
  name: string
  description?: string
  website?: string
  logo?: SanityImageSource
  contactEmail?: string
  address?: string
}

// Raw campaign data from Sanity (before processing)
export interface SanityCampaignRaw {
  _id: string
  id: string
  index: number
  title: string
  description: string
  impactDescription: string
  impactItem: string
  impactPrompt: SanityImpactPrompt
  unitPrice: number
  iconPath: SanityImageSource // This is a Sanity image object
  url: string
  unitImpact: number
  isFullySponsored?: boolean
  isFeatured?: boolean
  oneTimeUrl?: string
  organisation: SanityOrganisation // This will be populated in the query
  impactPromptAlt?: string
  impactOptions: SanityImpactOption[]
}

// Processed campaign data (ready to use in components)
export interface Campaign {
  id: string
  index: number
  title: string
  description: string
  impactDescription: string
  impactItem: string
  impactPrompt: SanityImpactPrompt
  unitPrice: number
  iconPath: string // Converted to URL string
  url: string
  unitImpact: number
  isFullySponsored?: boolean
  isFeatured?: boolean
  oneTimeUrl?: string
  organisationId: string
  organisationName?: string
  impactPromptAlt?: string
  totalImpactUnits: number // Added from local config
  impactOptions: SanityImpactOption[]
}

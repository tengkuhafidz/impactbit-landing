/**
 * Alternative import script using Sanity client
 * Run with: node import-script.js
 */

const { createClient } = require('@sanity/client')

// Configure your Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_TOKEN, // You'll need a write token
  apiVersion: '2025-09-30'
})

// Organisation data
const organisationData = {
  _type: 'organisation',
  _id: 'waktanjong-mosque',
  id: { _type: 'slug', current: 'waktanjong-mosque' },
  name: 'Masjid Wak Tanjong',
  description: 'A community mosque dedicated to serving the local Muslim community with various social impact programs.',
  website: 'https://waktanjong.org/'
}

// Campaign data (note: you'll need to upload images first and get asset IDs)
const campaignData = [
  {
    _type: 'campaign',
    _id: 'quranbit',
    id: { _type: 'slug', current: 'quranbit' },
    title: 'Quranbit',
    description: 'Gain rewards for every letter recited daily by thousands of students worldwide.',
    impactDescription: '1 lesson comprises a 5-7 minutes personalised Iqra\' or Quran lesson conducted by certified Asatizah',
    impactItem: 'Quranbit Lesson',
    impactPrompt: {
      present: 'enable',
      continuous: 'enabling',
      past: 'enabled'
    },
    unitPrice: 4,
    // iconPath: { _type: 'image', asset: { _type: 'reference', _ref: 'image-asset-id' } },
    url: 'https://quranbit.waktanjong.org/',
    unitImpact: 1,
    isFullySponsored: false,
    isFeatured: true,
    organisation: { _type: 'reference', _ref: 'waktanjong-mosque' },
    impactPromptAlt: '📖 Enabled',
    impactOptions: [
      { label: '1 lesson', units: 1, isDefault: true },
      { label: '1 week of lessons', units: 7 },
      { label: '1 month of lessons', units: 30 }
    ]
  },
  {
    _type: 'campaign',
    _id: 'community-pantry',
    id: { _type: 'slug', current: 'community-pantry' },
    title: 'Community Pantry',
    description: 'Gain rewards for every hungry stomach fed through our free-for-all pantry.',
    impactDescription: '1 pantry item comprises a daily necessity food item such as bread, cooking oil, sugar, milk, etc',
    impactItem: 'Pantry Item',
    impactPrompt: {
      present: 'contribute',
      continuous: 'contributing',
      past: 'contributed'
    },
    unitPrice: 4,
    // iconPath: { _type: 'image', asset: { _type: 'reference', _ref: 'image-asset-id' } },
    url: 'https://impacthive.waktanjong.org/collections/community-pantry',
    unitImpact: 1,
    isFullySponsored: false,
    isFeatured: true,
    organisation: { _type: 'reference', _ref: 'waktanjong-mosque' },
    impactPromptAlt: '🛒 Contributed',
    impactOptions: [
      { label: '1 pantry item', units: 1, isDefault: true },
      { label: '5 pantry items', units: 5 },
      { label: '10 pantry items', units: 10 }
    ]
  },
  {
    _type: 'campaign',
    _id: 'infaq-friday',
    id: { _type: 'slug', current: 'infaq-friday' },
    title: 'Free Food Forward',
    description: 'Gain rewards by providing free meals on Friday to mosque congregants and low-income families in the community.',
    impactDescription: '1 food packet comprises a complete meal to be distributed to the hungry around Singapore',
    impactItem: 'Food Packet',
    impactPrompt: {
      present: 'sponsor',
      continuous: 'sponsoring',
      past: 'sponsored'
    },
    unitPrice: 4,
    // iconPath: { _type: 'image', asset: { _type: 'reference', _ref: 'image-asset-id' } },
    url: 'https://impacthive.waktanjong.org/collections/infaq-friday',
    unitImpact: 1,
    isFullySponsored: false,
    isFeatured: true,
    organisation: { _type: 'reference', _ref: 'waktanjong-mosque' },
    impactPromptAlt: '🍱 Sponsored',
    impactOptions: [
      { label: '1 food packet', units: 1, isDefault: true },
      { label: '1 family', units: 5, description: '5 food packets' },
      { label: '3 families', units: 15, description: '15 food packets' },
      { label: '10 families', units: 50, description: '50 food packets' }
    ]
  }
]

async function importData() {
  try {
    console.log('Importing organisation...')
    await client.createOrReplace(organisationData)
    console.log('Organisation imported successfully')

    console.log('Importing campaigns...')
    for (const campaign of campaignData) {
      await client.createOrReplace(campaign)
      console.log(`Campaign "${campaign.title}" imported successfully`)
    }

    console.log('All data imported successfully!')
  } catch (error) {
    console.error('Import failed:', error)
  }
}

// Run the import
if (require.main === module) {
  importData()
}

module.exports = { importData, organisationData, campaignData }
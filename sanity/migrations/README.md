# Sanity Data Migration

This directory contains NDJSON files for migrating data from the mockCampaigns.ts file into Sanity.

## Files

- `organisations.ndjson` - Contains the organisation data (Masjid Wak Tanjong)
- `campaigns.ndjson` - Contains all three campaigns: Quranbit, Community Pantry, and Free Food Forward

## How to Import

1. First, set up your Sanity project and get your project ID
2. Update the environment variables in your `.env.local` file:
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Install the Sanity CLI if you haven't already:
   ```bash
   pnpm add -g @sanity/cli
   ```

4. Import the organisations first (since campaigns reference them):
   ```bash
   sanity dataset import organisations.ndjson production --replace
   ```

5. Then import the campaigns:
   ```bash
   sanity dataset import campaigns.ndjson production --replace
   ```

## Image Assets

Note: The image references in the campaigns.ndjson file reference existing Sanity image assets. If these don't exist in your Sanity project, you'll need to:

1. Upload the images manually through the Sanity Studio
2. Update the asset references in the NDJSON files with the correct asset IDs

## Data Mapping

The data has been mapped from the MockCampaign interface as follows:

- `totalImpactUnits` - Excluded as requested
- `organisationId` and `organisationName` - Converted to a reference to the organisation document
- `iconPath` (URL) - Converted to Sanity image asset reference
- `id` - Converted to Sanity slug field
- All other fields mapped directly with appropriate Sanity types
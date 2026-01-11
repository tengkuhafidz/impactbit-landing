"use client"

import { Campaign } from "@/lib/sanity/types"
import { Enabler } from "@/lib/firebase/firestore"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface ActivityTickerProps {
  contributions: Enabler[]
  campaigns: Campaign[]
  isLoading: boolean
}

export function ActivityTicker({ contributions, campaigns, isLoading }: ActivityTickerProps) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      // Hide hint once user has scrolled more than 50px
      if (container.scrollLeft > 50) {
        setHasScrolled(true)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])
  // Helper to get campaign details
  const getCampaign = (campaignId: string) =>
    campaigns.find(c => c.id === campaignId)

  // Helper to format time ago
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 justify-center overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 w-52 bg-secondary/50 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
    )
  }

  if (contributions.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Be the first to make an impact today!
      </p>
    )
  }

  // Filter contributions that have valid campaigns
  const validContributions = contributions.filter(c => getCampaign(c.campaignId || ""))

  if (validContributions.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-4">
        Be the first to make an impact today!
      </p>
    )
  }

  return (
    <div className="relative">
      <div ref={scrollContainerRef} className="overflow-x-auto py-4 px-1 scrollbar-hide">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {validContributions.map((contribution, index) => {
            const campaign = getCampaign(contribution.campaignId || "")
            if (!campaign) return null

            return (
              <Link
                key={`${contribution.campaignId}-${contribution.name}-${index}`}
                href={`/${campaign.id}`}
                className="ticker-bubble flex-shrink-0"
              >
                <div className="flex items-center gap-3 px-4 py-2.5 bg-card rounded-full shadow-soft border border-border/50 hover:shadow-elegant hover:border-primary/20 transition-all duration-200">
                  <div className="w-8 h-8 bg-white border rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                    <Image
                      src={campaign.iconPath}
                      alt={campaign.title}
                      width={20}
                      height={20}
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground truncate max-w-[100px]">
                      {contribution.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contribution.impactUnits} {campaign.impactItem}{contribution.impactUnits !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground/70 flex-shrink-0">
                    {getTimeAgo(contribution.date)}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      {/* Scroll hint on right side - hidden after user scrolls */}
      {!hasScrolled && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none">
          <div className="w-16 h-full bg-gradient-to-l from-background to-transparent"></div>
          <div className="absolute right-1 flex items-center gap-0.5 text-muted-foreground/50 animate-pulse">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  )
}

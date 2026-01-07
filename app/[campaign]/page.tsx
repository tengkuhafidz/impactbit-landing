"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getCampaign } from "@/lib/sanity/queries"
import type { Campaign } from "@/lib/sanity/types"
import { getRecentEnablersFromFirestore, type Enabler } from "@/lib/firebase/firestore"
import { MonthlyImpactGoal } from "@/components/monthly-impact-progress"
import { TrendingUp } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface CampaignPageProps {
  params: {
    campaign: string
  }
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const [campaignData, setCampaignData] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [animatedCount, setAnimatedCount] = useState(0)
  const [recentEnablers, setRecentEnablers] = useState<Enabler[]>([])
  const [enablersLoading, setEnablersLoading] = useState(true)

  // Fetch campaign data from Sanity
  useEffect(() => {
    async function fetchCampaign() {
      setIsLoading(true)
      try {
        const data = await getCampaign(params.campaign)
        setCampaignData(data)
      } catch (error) {
        console.error("Error fetching campaign:", error)
        setCampaignData(null)
      }
      setIsLoading(false)
    }
    fetchCampaign()
  }, [params.campaign])

  // Counter animation effect
  useEffect(() => {
    if (!campaignData) return

    const timer = setInterval(() => {
      setAnimatedCount((prev) => {
        if (prev < campaignData.totalImpactUnits) {
          return prev + Math.ceil(campaignData.totalImpactUnits / 100)
        }
        return campaignData.totalImpactUnits
      })
    }, 50)

    return () => clearInterval(timer)
  }, [campaignData])

  // Fetch recent enablers from Firestore
  useEffect(() => {
    async function fetchEnablers() {
      setEnablersLoading(true)
      try {
        const enablers = await getRecentEnablersFromFirestore(params.campaign)
        setRecentEnablers(enablers)
      } catch (error) {
        console.error("Error fetching enablers:", error)
        setRecentEnablers([])
      }
      setEnablersLoading(false)
    }
    fetchEnablers()
  }, [params.campaign])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-refreshing bg-pattern-dots flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading campaign...</p>
        </div>
      </div>
    )
  }

  if (!campaignData) {
    notFound()
  }

  // Helper function to get time ago text
  const getTimeAgo = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
    }
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }

  return (
    <div className="min-h-screen bg-refreshing bg-pattern-dots relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float animate-pulse-glow"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-accent/8 rounded-full animate-float animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-40 left-20 w-40 h-40 bg-primary/3 rounded-full animate-float animate-pulse-glow"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-28 h-28 bg-accent/6 rounded-full animate-float animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <section className="px-6 py-12 text-center max-w-6xl mx-auto relative z-10">
        <div className="animate-slide-up">
          <div className="mb-8 md:mb-12">
            <div className="w-24 h-24 mx-auto mb-2 relative">
              <Image
                src={campaignData.iconPath}
                alt={campaignData.title}
                width={96}
                height={96}
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-light text-foreground mb-4">
              <span className="text-muted-foreground">{campaignData.impactPrompt.present.charAt(0).toUpperCase() + campaignData.impactPrompt.present.slice(1)}</span> <span className="keep-together underline-accent">{campaignData.impactItem}s</span>
            </h1>
            <p className="text-md md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              {campaignData.description}
            </p>

            {/* Monthly Impact Goal - Interactive with expandable options */}
            {campaignData.targetMonthlyImpact && campaignData.targetMonthlyImpact > 0 && (
              <MonthlyImpactGoal
                currentMonthlyImpact={campaignData.monthlyImpact || 0}
                targetMonthlyImpact={campaignData.targetMonthlyImpact}
                impactItem={campaignData.impactItem}
                unitPrice={campaignData.unitPrice}
                campaignSlug={params.campaign}
                impactPromptContinuous={campaignData.impactPrompt.continuous}
              />
            )}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Community Impact</h2>
            {/* Total Impact Stats */}
            <div className="inline-block">
              <div className="number-glow mb-1 overflow-visible">
                <span className="text-5xl md:text-7xl font-serif font-light number-highlight leading-tight block py-2">
                  {animatedCount.toLocaleString()}
                </span>
              </div>
              <p className="text-lg md:text-xl font-serif font-light text-muted-foreground">
                {campaignData.impactItem}s {campaignData.impactPrompt.past} to date
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            {/* Recent Enablers */}
            <Card className="p-8 shadow-soft border-0 bg-card w-full max-w-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-light text-foreground">Recent {campaignData.impactPrompt.noun.charAt(0).toUpperCase() + campaignData.impactPrompt.noun.slice(1)}s</h3>
              </div>
              <div className="space-y-4">
                {enablersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground mt-2">Loading enablers...</p>
                  </div>
                ) : recentEnablers.length > 0 ? (
                  recentEnablers.map((enabler, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl transition-all duration-200 hover:bg-secondary/70"
                      >
                        <div className="w-10 h-10 gradient-primary text-primary-foreground rounded-xl flex items-center justify-center font-semibold shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-foreground text-lg">{enabler.name}</div>
                          <div className="text-muted-foreground mt-1">
                            {campaignData.impactPrompt.past.charAt(0).toUpperCase() + campaignData.impactPrompt.past.slice(1)} {enabler.impactUnits} {enabler.impactUnits === 1 ? campaignData.impactItem.toLowerCase() : `${campaignData.impactItem.toLowerCase()}s`}
                          </div>
                        </div>
                        <div className="text-muted-foreground text-sm text-right shrink-0">
                          {getTimeAgo(enabler.date)}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent {campaignData.impactPrompt.noun}s found</p>
                  </div>
                )}
              </div>
            </Card>

          </div>
        </div>
      </section>

      <section className="px-6 py-24 gradient-primary text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-light text-primary-foreground mb-8 text-balance leading-tight">
            Be part of this mission.
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
            {campaignData.impactPrompt.present.charAt(0).toUpperCase() + campaignData.impactPrompt.present.slice(1)} {campaignData.impactItem.toLowerCase()}s today and join thousands making knowledge accessible worldwide.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="h-14 px-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl font-medium shadow-soft transition-all duration-200 hover:shadow-elegant"
          >
            {campaignData.impactPrompt.present.charAt(0).toUpperCase() + campaignData.impactPrompt.present.slice(1)} {campaignData.impactItem}s
          </Button>
        </div>
      </section>

    </div >
  )
}

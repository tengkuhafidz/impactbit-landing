"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import mockCampaigns from "@/content/mockCampaigns"
import { HandHeart, Star, TrendingUp } from "lucide-react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { useEffect, useState } from "react"

interface CampaignPageProps {
  params: {
    campaign: string
  }
}

export default function CampaignPage({ params }: CampaignPageProps) {
  const campaignData = mockCampaigns[params.campaign]

  if (!campaignData) {
    notFound()
  }

  const [customLessons, setCustomLessons] = useState("")
  const [animatedCount, setAnimatedCount] = useState(0)
  const [selectedUnits, setSelectedUnits] = useState<number>(0)

  // Counter animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCount((prev) => {
        if (prev < campaignData.totalImpactUnits) {
          return prev + Math.ceil(campaignData.totalImpactUnits / 100)
        }
        return campaignData.totalImpactUnits
      })
    }, 50)

    return () => clearInterval(timer)
  }, [campaignData.totalImpactUnits])

  const handlePresetDonation = (units: number) => {
    setSelectedUnits(units)
    setCustomLessons("") // Clear custom input when preset is selected
  }

  const handleCustomInputChange = (value: string) => {
    setCustomLessons(value)
    if (value && Number.parseInt(value) > 0) {
      setSelectedUnits(Number.parseInt(value))
    } else if (!value) {
      setSelectedUnits(0)
    }
  }

  const activeUnits = customLessons && Number.parseInt(customLessons) > 0 ? Number.parseInt(customLessons) : selectedUnits
  const activePrice = activeUnits * campaignData.unitPrice

  // Mock data for community activity
  const leaderboard = [
    { name: "Ahmad", lessons: 365 },
    { name: "Fatima", lessons: 180 },
    { name: "Omar", lessons: 120 },
    { name: "Aisha", lessons: 90 },
    { name: "Yusuf", lessons: 60 },
  ]

  const recentActivity = [
    `Aisha ${campaignData.impactPrompt.past} 7 ${campaignData.impactItem.toLowerCase()}s`,
    `Zayd ${campaignData.impactPrompt.past} 30 ${campaignData.impactItem.toLowerCase()}s`,
    `Anonymous just ${campaignData.impactPrompt.past} 15 ${campaignData.impactItem.toLowerCase()}s`,
    `Maryam ${campaignData.impactPrompt.past} 7 ${campaignData.impactItem.toLowerCase()}s`,
    `Hassan ${campaignData.impactPrompt.past} 60 ${campaignData.impactItem.toLowerCase()}s`,
  ]

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
          <div className="mb-20 md:mb-24">
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
              {campaignData.title}
            </h1>
            <p className="text-md md:text-xl text-muted-foreground  max-w-2xl mx-auto">
              {campaignData.description}
            </p>
            <div className="number-glow mb-1 overflow-visible">
              <span className="text-7xl md:text-9xl lg:text-[10rem] font-serif font-light number-highlight leading-tight block py-4">
                {animatedCount.toLocaleString()}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-light text-foreground leading-tight">
              <span className="keep-together underline-accent">{campaignData.impactItem}s</span>{' '}
              <span className="text-muted-foreground">{campaignData.impactPrompt.past.charAt(0).toUpperCase() + campaignData.impactPrompt.past.slice(1)}</span>
            </h2>
          </div>
        </div>
      </section>

      <section className="px-6 -mt-16 relative z-10">
        <Card className="max-w-lg mx-auto p-8 shadow-elegant border-2 bg-card/95 backdrop-blur-sm animate-scale-in">
          <div className="text-center mb-6">
            <HandHeart className="w-12 h-12 text-muted-foreground/90 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-light text-foreground mb-2"><span className="text-muted-foreground">{campaignData.impactPrompt.present.charAt(0).toUpperCase() + campaignData.impactPrompt.present.slice(1)}</span> <span className="keep-together underline-accent">{campaignData.impactItem}s</span></h2>
            <p className="text-muted-foreground text-sm">{campaignData.impactDescription}</p>
          </div>

          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground text-center">Choose your monthly impact</p>
            {campaignData.impactOptions.map((option, index) => {
              const isHighlight = index === campaignData.impactOptions.length - 1
              return (
                <Button
                  key={index}
                  onClick={() => handlePresetDonation(option.units)}
                  className={`w-full min-h-[3.5rem] h-auto py-3 px-4 text-base sm:text-lg ${isHighlight ? "gradient-accent text-accent-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"} rounded-xl font-medium transition-all duration-200 hover:shadow-soft`}
                >
                  <span className="flex items-center justify-between w-full gap-2 flex-wrap sm:flex-nowrap">
                    <span className="text-left break-words">{option.label}</span>
                    <span className="whitespace-nowrap font-semibold">${(option.units * campaignData.unitPrice).toLocaleString()}/mo</span>
                  </span>
                </Button>
              )
            })}
            <p className="text-muted-foreground text-center mb-3">Or enter a custom amount</p>
            <div className="space-y-3">
              <Input
                type="number"
                placeholder={`Enter number of ${campaignData.impactItem.toLowerCase()}s`}
                value={customLessons}
                onChange={(e) => handleCustomInputChange(e.target.value)}
                className="h-14 text-lg rounded-xl border-border bg-background"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-border">

            <div>
              {activeUnits > 0 && (
                <div className="p-4 bg-secondary/50 rounded-xl space-y-2 animate-fade-in">
                  <p className="text-foreground font-medium">
                    You are {campaignData.impactPrompt.continuous} {activeUnits} {activeUnits === 1 ? campaignData.impactItem.toLowerCase() : `${campaignData.impactItem.toLowerCase()}s`} every month
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    ${activePrice.toLocaleString()} monthly
                  </p>
                </div>
              )}
              <Button
                disabled={activeUnits === 0}
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-soft disabled:opacity-50 mt-6"
              >
                Start Monthly Impact
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Community Impact</h2>
            <p className="text-xl text-muted-foreground">See how our community is making a difference</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Activity */}
            <Card className="p-8 shadow-soft border-0 bg-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-light text-foreground">Recent Enablers</h3>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl animate-fade-in transition-all duration-200 hover:bg-primary/10"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <p className="text-foreground font-medium">{activity}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Leaderboard */}
            <Card className="p-8 shadow-soft border-0 bg-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-light text-foreground">Top {campaignData.impactPrompt.present.charAt(0).toUpperCase() + campaignData.impactPrompt.present.slice(1)}rs</h3>
              </div>
              <div className="space-y-4">
                {leaderboard.map((enabler, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl transition-all duration-200 hover:bg-secondary/70"
                  >
                    <div className="w-10 h-10 gradient-primary text-primary-foreground rounded-xl flex items-center justify-center font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-foreground text-lg">{enabler.name}</div>
                      <div className="text-muted-foreground mt-1">{enabler.lessons} {campaignData.impactItem.toLowerCase()}s</div>
                    </div>
                  </div>
                ))}
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
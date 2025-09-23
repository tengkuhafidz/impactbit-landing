"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, Globe, Users, Heart, Star, TrendingUp } from "lucide-react"
import mockCampaigns from "@/content/mockCampaigns"

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
  const [showConfirmation, setShowConfirmation] = useState("")

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

  const handleDonation = (units: number, description: string) => {
    const itemLabel = units === 1 ? campaignData.impactItem.toLowerCase() : `${campaignData.impactItem.toLowerCase()}s`
    setShowConfirmation(`${campaignData.impactPromptAlt} ${units} ${itemLabel}${description ? `${description}` : ''} 🎉`)
    setTimeout(() => setShowConfirmation(""), 3000)
  }

  const customPrice = customLessons ? Number.parseInt(customLessons) * campaignData.unitPrice : 0

  // Mock data for community activity
  const leaderboard = [
    { name: "Ahmad", lessons: 365, amount: 1460 },
    { name: "Fatima", lessons: 180, amount: 720 },
    { name: "Omar", lessons: 120, amount: 480 },
    { name: "Aisha", lessons: 90, amount: 360 },
    { name: "Yusuf", lessons: 60, amount: 240 },
  ]

  const recentActivity = [
    `Aisha enabled 7 ${campaignData.impactItem.toLowerCase()}s (1 week)`,
    `Zayd enabled 30 ${campaignData.impactItem.toLowerCase()}s (1 month)`,
    `Anonymous just enabled 15 ${campaignData.impactItem.toLowerCase()}s`,
    `Maryam enabled 7 ${campaignData.impactItem.toLowerCase()}s (1 week)`,
    `Hassan enabled 60 ${campaignData.impactItem.toLowerCase()}s (2 months)`,
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

      <section className="px-6 py-16 md:py-20 text-center max-w-6xl mx-auto relative z-10">
        <div className="animate-slide-up">
          <div className="mb-12">
            <p className="text-lg md:text-xl text-muted-foreground mb-6 font-light">Together, we've enabled</p>
            <div className="number-glow mb-6">
              <span className="text-8xl md:text-9xl lg:text-[12rem] font-serif font-light number-highlight leading-none block">
                {animatedCount.toLocaleString()}+
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-8 text-balance leading-tight">
              {campaignData.impactItem}s
            </h1>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 -mt-16 relative z-10">
        <Card className="max-w-lg mx-auto p-8 shadow-elegant border-0 bg-card/95 backdrop-blur-sm animate-scale-in">
          <div className="text-center mb-8">
            <Heart className="w-8 h-8 mx-auto text-accent mb-4" />
            <h2 className="text-3xl font-serif font-light text-foreground mb-2">Enable {campaignData.impactItem}s</h2>
            <p className="text-muted-foreground mb-4">{campaignData.description}</p>
            <p className="text-muted-foreground">Choose your impact</p>
          </div>

          <div className="space-y-4 mb-8">
            {campaignData.impactOptions.map((option, index) => {
              const isHighlight = index === campaignData.impactOptions.length - 1
              return (
                <Button
                  key={index}
                  onClick={() => handleDonation(option.units, option.description ? ` (${option.description})` : "")}
                  className={`w-full h-14 text-lg ${isHighlight ? "gradient-accent text-accent-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"} rounded-xl font-medium transition-all duration-200 hover:shadow-soft`}
                >
                  {option.label} → ${(option.units * campaignData.unitPrice).toLocaleString()}
                </Button>
              )
            })}
          </div>

          <div className="space-y-4">
            <Input
              type="number"
              placeholder={`Enter number of ${campaignData.impactItem.toLowerCase()}s`}
              value={customLessons}
              onChange={(e) => setCustomLessons(e.target.value)}
              className="h-14 text-lg rounded-xl border-border bg-background"
            />
            {customLessons && Number.parseInt(customLessons) > 0 && (
              <div className="p-4 bg-secondary/50 rounded-xl space-y-2">
                <p className="text-foreground font-medium">
                  You are enabling {Number.parseInt(customLessons)} {Number.parseInt(customLessons) === 1 ? campaignData.impactItem.toLowerCase() : `${campaignData.impactItem.toLowerCase()}s`} every month
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  ${customPrice} monthly
                </p>
              </div>
            )}
            <Button
              onClick={() => handleDonation(Number.parseInt(customLessons) || 0, "")}
              disabled={!customLessons || Number.parseInt(customLessons) <= 0}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-soft disabled:opacity-50"
            >
              Commit to Monthly Impact
            </Button>
          </div>

          {showConfirmation && (
            <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-xl animate-fade-in">
              <p className="text-accent text-center font-medium">{showConfirmation}</p>
            </div>
          )}
        </Card>
      </section>

      <section className="px-6 py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Community Impact</h2>
            <p className="text-xl text-muted-foreground">See how our community is making a difference</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Leaderboard */}
            <Card className="p-8 shadow-soft border-0 bg-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-2xl font-serif font-light text-foreground">Top Enablers</h3>
              </div>
              <div className="space-y-4">
                {leaderboard.map((enabler, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl transition-all duration-200 hover:bg-secondary/70"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 gradient-primary text-primary-foreground rounded-xl flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-foreground text-lg">{enabler.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground text-lg">{enabler.lessons} {campaignData.impactItem.toLowerCase()}s</div>
                      <div className="text-muted-foreground">${enabler.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-8 shadow-soft border-0 bg-card">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-2xl font-serif font-light text-foreground">Recent Activity</h3>
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
          </div>
        </div>
      </section>

      <section className="px-6 py-24 gradient-primary text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-light text-primary-foreground mb-8 text-balance leading-tight">
            Be part of this mission.
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
            Enable {campaignData.impactItem.toLowerCase()}s today and join thousands making knowledge accessible worldwide.
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
            className="h-14 px-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl font-medium shadow-soft transition-all duration-200 hover:shadow-elegant"
          >
            Enable {campaignData.impactItem}s
          </Button>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden z-20">
        <Button
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          className="w-full h-14 text-lg gradient-primary text-primary-foreground rounded-xl font-medium shadow-soft"
        >
          Enable {campaignData.impactItem}s
        </Button>
      </div>
    </div>
  )
}
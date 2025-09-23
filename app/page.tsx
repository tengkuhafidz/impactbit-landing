"use client"

import { useState, useEffect } from "react"
import mockCampaigns from "@/content/mockCampaigns"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Heart, Users, TrendingUp, Star, DollarSign, Speaker, SpeakerIcon, Share, RefreshCcw, Share2 } from "lucide-react"

export default function HomePage() {
  const campaigns = Object.values(mockCampaigns)
  const [animatedImpact, setAnimatedImpact] = useState(0)

  // Calculate overall impact
  const totalImpact = campaigns.reduce((sum, campaign) => sum + campaign.totalImpactUnits, 0)
  const totalValue = campaigns.reduce((sum, campaign) => sum + (campaign.totalImpactUnits * campaign.unitPrice), 0)
  const activeCampaigns = campaigns.length

  // Counter animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedImpact((prev) => {
        if (prev < totalImpact) {
          return prev + Math.ceil(totalImpact / 100)
        }
        return totalImpact
      })
    }, 30)

    return () => clearInterval(timer)
  }, [totalImpact])

  return (
    <div className="min-h-screen bg-background bg-pattern-dots relative overflow-hidden">
      {/* Floating elements */}
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

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 text-center max-w-6xl mx-auto relative z-10">
        <div className="animate-slide-up">
          <p className="text-lg md:text-xl text-muted-foreground mb-2 font-light">Together, we've created</p>
          <div className="number-glow mb-1 overflow-visible">
            <span className="text-8xl md:text-9xl lg:text-[10rem] font-serif font-light number-highlight leading-tight block py-4">
              {animatedImpact.toLocaleString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-foreground mb-6 text-balance leading-tight">
            Units of Impact
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-light">
            Join thousands making a difference through micro-donations. Every contribution creates lasting change in our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
              className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-soft"
            >
              Explore Campaigns
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              onClick={() => document.getElementById('impact-stats')?.scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="h-14 px-8 text-lg rounded-xl font-medium border-border hover:bg-secondary/50"
            >
              See Our Impact
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact-stats" className="px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <Card className="p-6 shadow-soft border-0 bg-card animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-serif font-light text-foreground mb-1">{totalImpact.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Impact Created</p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-soft border-0 bg-card animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-serif font-light text-foreground mb-1">2,891</div>
                <p className="text-sm text-muted-foreground">Impact Creators</p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-soft border-0 bg-card animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Share2 className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-serif font-light text-foreground mb-1">342</div>
                <p className="text-sm text-muted-foreground">Impact Advocates</p>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-soft border-0 bg-card animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-serif font-light text-foreground mb-1">{activeCampaigns}</div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="px-6 py-16 md:py-24 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-light text-foreground mb-4">Our Campaigns</h2>
            <p className="text-xl text-muted-foreground font-light">Choose how you want to make a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((campaign, index) => {
              return (
                <Card
                  key={campaign.id}
                  className="overflow-hidden border-0 shadow-soft bg-card hover:shadow-elegant transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="relative p-8">
                    {campaign.isFeatured && (
                      <Badge className="absolute top-4 right-4 bg-accent/10 text-accent border-accent/20">
                        Featured
                      </Badge>
                    )}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                        <img src={campaign.iconPath} alt={campaign.title} className="w-12 h-12 object-contain" />
                      </div>
                      <CardTitle className="text-2xl font-serif font-light">{campaign.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base text-muted-foreground">
                      {campaign.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-8 pb-6">
                    <div className="p-4 bg-secondary/50 rounded-xl mb-6">
                      <p className="text-sm text-foreground/80">{campaign.impactDescription}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-primary/5 rounded-xl">
                        <p className="text-2xl font-serif font-light text-primary">
                          {campaign.totalImpactUnits.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{campaign.impactItem}s enabled</p>
                      </div>
                      <div className="text-center p-3 bg-accent/5 rounded-xl">
                        <p className="text-2xl font-serif font-light text-accent">${campaign.unitPrice}</p>
                        <p className="text-xs text-muted-foreground mt-1">per {campaign.impactItem}</p>
                      </div>
                    </div>

                    {campaign.organisationName && (
                      <p className="text-sm text-muted-foreground text-center">
                        by {campaign.organisationName}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="p-8 pt-0">
                    <Button
                      className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-soft group"
                      asChild
                    >
                      <Link href={`/${campaign.id}`}>
                        Enable {campaign.impactItem}s
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 gradient-primary text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-light text-primary-foreground mb-8 text-balance leading-tight">
            Ready to make an impact?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-12 font-light">
            Start with as little as $4. Every contribution creates meaningful change.
          </p>
          <Button
            size="lg"
            className="h-14 px-12 text-lg bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-xl font-medium shadow-soft transition-all duration-200 hover:shadow-elegant"
            asChild
          >
            <Link href={`/${campaigns[0]?.id}`}>
              Start Contributing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-sm border-t border-border lg:hidden z-20">
        <Button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
          className="w-full h-14 text-lg gradient-primary text-primary-foreground rounded-xl font-medium shadow-soft"
        >
          Explore Campaigns
        </Button>
      </div>
    </div>
  )
}
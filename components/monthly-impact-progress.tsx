'use client'

import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface MonthlyImpactGoalProps {
  currentMonthlyImpact: number
  targetMonthlyImpact: number
  impactItem: string
  impactPromptPast: string
  className?: string
}

export function MonthlyImpactGoal({
  currentMonthlyImpact,
  targetMonthlyImpact,
  impactItem,
  impactPromptPast,
  className
}: MonthlyImpactGoalProps) {
  const [animatedCurrent, setAnimatedCurrent] = React.useState(0)
  const [animatedProgress, setAnimatedProgress] = React.useState(0)

  const percentage = targetMonthlyImpact > 0
    ? Math.round((currentMonthlyImpact / targetMonthlyImpact) * 100)
    : 0
  const displayPercentage = Math.min(percentage, 100)
  const remaining = Math.max(0, targetMonthlyImpact - currentMonthlyImpact)

  // Animate the current count and progress bar
  React.useEffect(() => {
    // Counter animation
    const counterTimer = setInterval(() => {
      setAnimatedCurrent(prev => {
        if (prev < currentMonthlyImpact) {
          return prev + Math.ceil(currentMonthlyImpact / 50)
        }
        return currentMonthlyImpact
      })
    }, 30)

    // Progress bar animation
    const timer = setTimeout(() => {
      const progressTimer = setInterval(() => {
        setAnimatedProgress(prev => {
          if (prev < displayPercentage) {
            return prev + 1
          }
          clearInterval(progressTimer)
          return displayPercentage
        })
      }, 15)
      return () => clearInterval(progressTimer)
    }, 200)

    return () => {
      clearInterval(counterTimer)
      clearTimeout(timer)
    }
  }, [currentMonthlyImpact, displayPercentage])

  // Don't render if no target is set
  if (!targetMonthlyImpact || targetMonthlyImpact === 0) {
    return null
  }

  return (
    <div className={cn(
      "w-full max-w-md md:max-w-2xl mx-auto px-5 md:px-8 py-4 md:py-6 rounded-2xl bg-gradient-to-br from-primary/8 to-accent/5 border border-primary/15 shadow-soft animate-scale-in",
      className
    )}>
      {/* Numbers row */}
      <div className="flex items-baseline gap-1.5 md:gap-2 mb-1 text-center justify-center">
        <span className="text-2xl md:text-3xl font-bold text-accent">{animatedCurrent.toLocaleString()}</span>
        <span className="text-sm md:text-base text-muted-foreground">of</span>
        <span className="text-lg md:text-xl font-semibold text-foreground">{targetMonthlyImpact.toLocaleString()}</span>
      </div>

      {/* Description */}
      <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
        monthly {impactItem.toLowerCase()}s {impactPromptPast}
      </p>

      {/* Progress bar - more prominent */}
      <div className="relative mb-2 md:mb-3">
        <Progress
          value={animatedProgress}
          className="h-3 md:h-4 bg-secondary"
          indicatorClassName="bg-accent"
        />
      </div>

      {/* Remaining */}
      <p className="text-sm md:text-base text-muted-foreground">
        <span className="font-semibold text-primary">{remaining.toLocaleString()}</span> more to go
      </p>
    </div>
  )
}

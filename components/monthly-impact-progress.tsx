'use client'

import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface ImpactOption {
  label: string
  units: number
}

interface MonthlyImpactGoalProps {
  currentMonthlyImpact: number
  targetMonthlyImpact: number
  impactItem: string
  impactOptions: ImpactOption[]
  unitPrice: number
  campaignSlug: string
  impactPromptContinuous: string
  className?: string
}

export function MonthlyImpactGoal({
  currentMonthlyImpact,
  targetMonthlyImpact,
  impactItem,
  impactOptions,
  unitPrice,
  campaignSlug,
  impactPromptContinuous,
  className
}: MonthlyImpactGoalProps) {
  const [animatedCurrent, setAnimatedCurrent] = React.useState(0)
  const [animatedProgress, setAnimatedProgress] = React.useState(0)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [hoverUnits, setHoverUnits] = React.useState(0)
  const [selectedUnits, setSelectedUnits] = React.useState(0)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [customUnits, setCustomUnits] = React.useState('')

  const percentage = targetMonthlyImpact > 0
    ? Math.round((currentMonthlyImpact / targetMonthlyImpact) * 100)
    : 0
  const displayPercentage = Math.min(percentage, 100)
  const remaining = Math.max(0, targetMonthlyImpact - currentMonthlyImpact)

  // Preview calculations - use selectedUnits when in confirmation, otherwise hoverUnits
  const activePreviewUnits = showConfirmation ? selectedUnits : hoverUnits
  const rawPreviewPercentage = targetMonthlyImpact > 0
    ? Math.round((activePreviewUnits / targetMonthlyImpact) * 100)
    : 0
  // Use actual percentage, but ensure minimum of 1% so user sees some impact
  const previewPercentage = activePreviewUnits > 0 ? Math.max(rawPreviewPercentage, 1) : 0
  const remainingAfterPreview = Math.max(0, remaining - activePreviewUnits)
  const isShowingPreview = activePreviewUnits > 0

  // Calculated values for confirmation
  const activePrice = selectedUnits * unitPrice

  // Animate the current count and progress bar
  React.useEffect(() => {
    const counterTimer = setInterval(() => {
      setAnimatedCurrent(prev => {
        if (prev < currentMonthlyImpact) {
          return prev + Math.ceil(currentMonthlyImpact / 50)
        }
        return currentMonthlyImpact
      })
    }, 30)

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

  if (!targetMonthlyImpact || targetMonthlyImpact === 0) {
    return null
  }

  const isGoalMet = currentMonthlyImpact >= targetMonthlyImpact

  const handleSelectOption = (units: number) => {
    setSelectedUnits(units)
    setCustomUnits('')
    setShowConfirmation(true)
  }

  const handleCustomInputChange = (value: string) => {
    setCustomUnits(value)
    const parsed = Number.parseInt(value)
    if (parsed > 0) {
      setHoverUnits(parsed)
    } else {
      setHoverUnits(0)
    }
  }

  const handleCustomSubmit = () => {
    const parsed = Number.parseInt(customUnits)
    if (parsed > 0) {
      setSelectedUnits(parsed)
      setShowConfirmation(true)
    }
  }

  const handleGoBack = () => {
    setShowConfirmation(false)
    setSelectedUnits(0)
    setHoverUnits(0)
    setCustomUnits('')
  }

  const handleStartImpact = () => {
    window.location.href = `https://impactbit.org/payment?campaign=${campaignSlug}&quantity=${selectedUnits}`
  }

  return (
    <div className={cn(
      "w-full max-w-md md:max-w-xl mx-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/8 border-2 border-primary/20 shadow-soft animate-scale-in overflow-hidden",
      className
    )}>
      {/* Progress section - always visible */}
      <div className="px-5 md:px-8 py-5 md:py-7">
        {/* Numbers row */}
        <div className="mb-3 text-center">
          <div className="flex items-baseline gap-1.5 md:gap-2 justify-center flex-wrap">
            <span className={cn(
              "text-3xl md:text-4xl font-bold text-accent transition-all duration-300",
              isShowingPreview && "drop-shadow-[0_0_8px_rgba(200,160,60,0.8)]"
            )}>
              {isShowingPreview
                ? (currentMonthlyImpact + activePreviewUnits).toLocaleString()
                : animatedCurrent.toLocaleString()
              }
            </span>
            <span className="text-sm md:text-base text-muted-foreground">of</span>
            <span className="text-xl md:text-2xl font-semibold text-foreground">{targetMonthlyImpact.toLocaleString()}</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {impactItem.toLowerCase()}s enabled monthly
          </p>
        </div>

        {/* Progress bar */}
        <div className={cn(showConfirmation ? "" : "mb-4")}>
          {/* Preview indicator label */}
          {isShowingPreview && (
            <div className="flex items-center justify-center gap-2 mb-2 animate-slide-right">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
                <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium text-primary">
                  +{activePreviewUnits.toLocaleString()} with your impact
                </span>
              </div>
            </div>
          )}
          <Progress
            value={animatedProgress}
            previewValue={previewPercentage}
            previewClassName="bg-primary/60"
            className={cn(
              "h-3 md:h-4 bg-primary/20 border border-primary/30 transition-shadow duration-300",
              isShowingPreview && "shadow-[0_0_12px_rgba(200,160,60,0.5)]"
            )}
            indicatorClassName="bg-accent"
          />
          <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
            <span>
              {animatedProgress}%
              {isShowingPreview && rawPreviewPercentage > 0 && (
                <span className="text-primary font-medium">
                  {' → '}{Math.min(animatedProgress + rawPreviewPercentage, 100)}%
                </span>
              )}
            </span>
            {isShowingPreview ? (
              <span className="text-primary font-medium">
                {remainingAfterPreview > 0 ? `${remainingAfterPreview.toLocaleString()} more to go` : 'Fully sustained with your help!'}
              </span>
            ) : (
              <span className="text-primary font-medium">{remaining.toLocaleString()} more to go</span>
            )}
          </div>
        </div>

        {/* Call to action button - only when not in confirmation */}
        {!showConfirmation && (
          <>
            {isGoalMet ? (
              <p className="text-sm md:text-base text-accent font-medium text-center">
                Thank you for your support!
              </p>
            ) : (
              <div className="text-center mt-8">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-soft flex items-center justify-center gap-2"
                >
                  Help reach the goal
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {!showConfirmation ? (
        /* Expandable options section */
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-5 md:px-8 pb-5 md:pb-7 pt-2 border-t border-primary/10">
            <p className="text-sm text-foreground text-center mb-1">
              Every contribution helps close the gap.
            </p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Choose a monthly impact to enable:
            </p>
            <div className="space-y-3">
              {impactOptions.map((option, index) => {
                const isLastOption = index === impactOptions.length - 1
                const optionPrice = option.units * unitPrice

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option.units)}
                    onMouseEnter={() => setHoverUnits(option.units)}
                    onMouseLeave={() => setHoverUnits(0)}
                    className={cn(
                      "w-full min-h-[3.5rem] h-auto py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:shadow-soft flex items-center justify-between",
                      isLastOption
                        ? "gradient-accent text-accent-foreground"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                  >
                    <span className="text-left break-words">{option.label}</span>
                    <span className="whitespace-nowrap font-semibold">${optionPrice.toLocaleString()}/mo</span>
                  </button>
                )
              })}
            </div>

            {/* Custom input */}
            <div className="mt-4 pt-4 border-t border-primary/10">
              <p className="text-sm text-muted-foreground text-center mb-3">
                Or enter a custom amount:
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={`Monthly ${impactItem.toLowerCase()}s`}
                  value={customUnits}
                  onChange={(e) => handleCustomInputChange(e.target.value)}
                  onBlur={() => !customUnits && setHoverUnits(0)}
                  className="flex-1 h-12 px-4 text-base rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customUnits || Number.parseInt(customUnits) <= 0}
                  className="px-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Go
                </button>
              </div>
              {customUnits && Number.parseInt(customUnits) > 0 && (
                <p className="text-sm text-muted-foreground text-center mt-2">
                  ${(Number.parseInt(customUnits) * unitPrice).toLocaleString()}/mo
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Confirmation View - replaces only the options area */
        <div className="px-5 md:px-8 pb-5 md:pb-7 pt-6 border-t border-primary/10 animate-slide-right">
          <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4 border border-primary/20">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                You will be {impactPromptContinuous}
              </p>
              <div className="py-2">
                <div className="text-4xl md:text-5xl font-serif font-light text-foreground mb-1">
                  {selectedUnits}
                </div>
                <div className="text-lg font-light text-foreground">
                  {selectedUnits === 1 ? impactItem : `${impactItem}s`}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">every month</p>
              <div className="pt-2 border-t border-border/50">
                <div className="text-xs text-muted-foreground mb-1">Monthly contribution</div>
                <div className="text-2xl font-semibold text-foreground">
                  ${activePrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStartImpact}
              className="w-full py-3 text-base gradient-accent text-accent-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-elegant"
            >
              Start This Impact
            </button>
            <button
              onClick={handleGoBack}
              className="w-full py-2.5 text-sm rounded-xl font-medium transition-all duration-200 hover:bg-secondary border border-border"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react'

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
  const [selectedUnits, setSelectedUnits] = React.useState(0)
  const [showConfirmation, setShowConfirmation] = React.useState(false)
  const [showCustomInput, setShowCustomInput] = React.useState(false)
  const [quantity, setQuantity] = React.useState(1)

  const percentage = targetMonthlyImpact > 0
    ? Math.round((currentMonthlyImpact / targetMonthlyImpact) * 100)
    : 0
  const displayPercentage = Math.min(percentage, 100)
  const remaining = Math.max(0, targetMonthlyImpact - currentMonthlyImpact)

  // Preview calculations - use selectedUnits when in confirmation, quantity when in custom input, otherwise 0
  const activePreviewUnits = showConfirmation ? selectedUnits : (showCustomInput ? quantity : 0)
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
    setShowConfirmation(true)
  }

  const handleCustomClick = () => {
    setShowCustomInput(true)
  }

  const handleIncrement = () => {
    setQuantity(prev => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity(prev => Math.max(1, prev - 1))
  }

  const handleQuantityChange = (value: string) => {
    // Only allow positive integers
    const sanitized = value.replace(/[^0-9]/g, '')
    if (sanitized === '') {
      setQuantity(1)
      return
    }
    const parsed = Number.parseInt(sanitized)
    if (parsed >= 1) {
      setQuantity(parsed)
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleGoBack = () => {
    setShowConfirmation(false)
    setShowCustomInput(false)
    setSelectedUnits(0)
    setQuantity(1)
  }

  const handleCustomDonate = () => {
    window.location.href = `https://impactbit.org/payment?campaign=${campaignSlug}&quantity=${quantity}`
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
            {impactItem.toLowerCase()}s sponsored monthly
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
              <span className="text-primary font-medium">
                {remaining > 0 ? `${remaining.toLocaleString()} more to go` : 'Target reached! 🎉'}
              </span>
            )}
          </div>
        </div>

        {/* Call to action button - only when not in confirmation */}
        {!showConfirmation && (
          <>
            {isGoalMet ? (
              <p className="text-sm md:text-base text-accent font-medium text-center">
                This programme is fully sustained by the ImpactBit community 💛
              </p>
            ) : (
              <div className="text-center mt-8">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full py-3 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-soft flex items-center justify-center gap-2"
                >
                  Help us reach the goal
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Expandable section */}
      <div className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
      )}>
        {!showConfirmation && !showCustomInput ? (
          /* Options view - preset buttons + custom */
          <div className="px-5 md:px-8 pb-5 md:pb-7 pt-4 border-t border-primary/10">
            <p className="text-sm text-muted-foreground text-center mb-4">
              Choose your monthly impact:
            </p>
            <div className="space-y-3">
              {impactOptions.map((option, index) => {
                const optionPrice = option.units * unitPrice

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectOption(option.units)}
                    className="w-full min-h-[3.5rem] h-auto py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:shadow-soft flex items-center justify-between bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <span className="text-left break-words">{option.label}</span>
                    <span className="whitespace-nowrap font-semibold">${optionPrice.toLocaleString()}/mo</span>
                  </button>
                )
              })}
              {/* Custom amount button */}
              <button
                onClick={handleCustomClick}
                className="w-full min-h-[3.5rem] h-auto py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:shadow-soft gradient-accent text-accent-foreground"
              >
                Choose a custom amount
              </button>
            </div>
          </div>
        ) : showCustomInput ? (
          /* Custom input view */
          <div className="px-5 md:px-8 pb-5 md:pb-7 pt-4 border-t border-primary/10 animate-slide-right">
            <p className="text-lg md:text-xl text-foreground text-center mb-5">
              How many {impactItem.toLowerCase()}s would you like to sponsor monthly?
            </p>

            {/* Quantity selector */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="w-12 h-12 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onFocus={handleInputFocus}
                className="w-24 h-14 text-center text-2xl font-semibold rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleIncrement}
                className="w-12 h-12 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-all duration-200 flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCustomDonate}
                className="w-full py-3 text-base gradient-accent text-accent-foreground rounded-xl font-medium transition-all duration-200 hover:shadow-elegant"
              >
                Donate ${(quantity * unitPrice).toLocaleString()} monthly
              </button>
              <button
                onClick={handleGoBack}
                className="w-full py-2.5 text-sm rounded-xl font-medium transition-all duration-200 hover:bg-secondary border border-border"
              >
                Back
              </button>
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
    </div>
  )
}

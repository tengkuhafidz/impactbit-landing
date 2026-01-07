'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

function Progress({
  className,
  indicatorClassName,
  value,
  previewValue,
  previewClassName,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
  previewValue?: number
  previewClassName?: string
}) {
  const totalValue = Math.min((value || 0) + (previewValue || 0), 100)

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
        className,
      )}
      {...props}
    >
      {/* Preview indicator (behind main) */}
      {(previewValue ?? 0) > 0 && (
        <div
          data-slot="progress-preview"
          className={cn("absolute h-full transition-all duration-300", previewClassName || "bg-primary/40")}
          style={{ width: `${totalValue}%` }}
        />
      )}
      {/* Main indicator */}
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("bg-primary h-full w-full flex-1 transition-all relative z-10", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { getAllCampaigns } from "@/lib/sanity/queries"
import {
  subscribeToEnablersFromLast24Hours,
  Enabler,
} from "@/lib/firebase/firestore"
import type { Campaign } from "@/lib/sanity/types"
import Image from "next/image"
import Link from "next/link"

const BUBBLE_COLORS = [
  { bg: "from-emerald-400/90 to-teal-500/90", glow: "shadow-emerald-500/40" },
  { bg: "from-amber-400/90 to-orange-500/90", glow: "shadow-amber-500/40" },
  { bg: "from-sky-400/90 to-blue-500/90", glow: "shadow-sky-500/40" },
  { bg: "from-violet-400/90 to-purple-500/90", glow: "shadow-violet-500/40" },
  { bg: "from-rose-400/90 to-pink-500/90", glow: "shadow-rose-500/40" },
]

// Physics constants
const GRAVITY = 0.4
const BOUNCE_DAMPING = 0.6
const FRICTION = 0.99
const SETTLE_THRESHOLD = 0.5
const MIN_DROP_DELAY = 150 // Min ms between ball drops
const MAX_DROP_DELAY = 400 // Max ms between ball drops
const RENDER_INTERVAL = 2 // Only update React state every N frames

interface Ball {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
  settled: boolean
  active: boolean // Whether the ball has started falling
  isNew: boolean // Whether this is a new live ball (for highlight effect)
  contribution: Enabler
  campaign: Campaign
  colorIndex: number
}

export default function ImpactPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [contributions, setContributions] = useState<Enabler[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [balls, setBalls] = useState<Ball[]>([])
  const [, setTick] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)
  const ballsRef = useRef<Ball[]>([])
  const animatingRef = useRef(false)
  const containerSizeRef = useRef({ width: 800, height: 800 })
  const frameCountRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio on mount
  useEffect(() => {
    audioRef.current = new Audio("/new-contribution.mp3")
    audioRef.current.volume = 0.5
  }, [])

  // Drag state
  const [draggedBallId, setDraggedBallId] = useState<string | null>(null)
  const dragRef = useRef<{
    ballId: string | null
    startX: number
    startY: number
    lastX: number
    lastY: number
    lastTime: number
    velocityX: number
    velocityY: number
  }>({
    ballId: null,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0,
  })

  // Track contribution IDs we've already created balls for
  const processedContributionsRef = useRef<Set<string>>(new Set())

  // Fetch campaigns and subscribe to real-time contributions
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    async function initData() {
      try {
        // Fetch campaigns first
        const campaignsData = await getAllCampaigns()
        setCampaigns(campaignsData)

        // Subscribe to real-time contributions
        unsubscribe = subscribeToEnablersFromLast24Hours((contributionsData) => {
          setContributions(contributionsData)
          setIsLoading(false)
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }
    initData()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const getCampaign = useCallback(
    (campaignId: string) => campaigns.find((c) => c.id === campaignId),
    [campaigns]
  )

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

  // Drag handlers
  const handleDragStart = useCallback((ballId: string, clientX: number, clientY: number) => {
    dragRef.current = {
      ballId,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      lastTime: Date.now(),
      velocityX: 0,
      velocityY: 0,
    }
    setDraggedBallId(ballId)

    // Un-settle the ball
    const ballIndex = ballsRef.current.findIndex(b => b.id === ballId)
    if (ballIndex >= 0) {
      ballsRef.current[ballIndex].settled = false
    }
  }, [])

  const handleDragMove = useCallback((clientX: number, clientY: number) => {
    if (!dragRef.current.ballId) return

    const now = Date.now()
    const dt = Math.max(1, now - dragRef.current.lastTime)

    // Calculate velocity (pixels per frame, assuming 60fps)
    const velocityX = ((clientX - dragRef.current.lastX) / dt) * 16
    const velocityY = ((clientY - dragRef.current.lastY) / dt) * 16

    // Smooth velocity with previous
    dragRef.current.velocityX = velocityX * 0.5 + dragRef.current.velocityX * 0.5
    dragRef.current.velocityY = velocityY * 0.5 + dragRef.current.velocityY * 0.5

    dragRef.current.lastX = clientX
    dragRef.current.lastY = clientY
    dragRef.current.lastTime = now

    // Move the ball directly
    const ballIndex = ballsRef.current.findIndex(b => b.id === dragRef.current.ballId)
    if (ballIndex >= 0) {
      ballsRef.current[ballIndex].x = clientX
      ballsRef.current[ballIndex].y = clientY
      ballsRef.current[ballIndex].vx = 0
      ballsRef.current[ballIndex].vy = 0
      setBalls([...ballsRef.current])
    }
  }, [])

  const handleDragEnd = useCallback(() => {
    if (!dragRef.current.ballId) return

    // Apply throw velocity to the ball
    const ballIndex = ballsRef.current.findIndex(b => b.id === dragRef.current.ballId)
    if (ballIndex >= 0) {
      // Apply velocity with a multiplier for more dramatic throws
      const throwMultiplier = 1.5
      ballsRef.current[ballIndex].vx = dragRef.current.velocityX * throwMultiplier
      ballsRef.current[ballIndex].vy = dragRef.current.velocityY * throwMultiplier
      ballsRef.current[ballIndex].settled = false
    }

    dragRef.current.ballId = null
    setDraggedBallId(null)

    // Restart animation if needed
    if (!animatingRef.current) {
      animatingRef.current = true
      requestAnimationFrame(runPhysics)
    }
  }, [])

  // Physics function (extracted for reuse)
  const runPhysics = useCallback(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    containerSizeRef.current = { width, height }
    const floorY = height - 20
    const now = Date.now()
    frameCountRef.current++

    let hasMovement = false

    // Check if it's time to release next ball (one at a time with random delays)
    const timeSinceLastDrop = now - lastDropTimeRef.current
    if (timeSinceLastDrop >= nextDropDelayRef.current) {
      const nextIndex = nextBallIndexRef.current

      if (nextIndex < ballsRef.current.length) {
        const ball = ballsRef.current[nextIndex]
        if (ball) {
          ball.active = true
          const size = ball.size
          const margin = size / 2 + 30
          // Random x position across full viewport
          ball.x = margin + Math.random() * (width - margin * 2)
          ball.y = -size
          ball.vx = (Math.random() - 0.5) * 4
        }

        nextBallIndexRef.current++
        lastDropTimeRef.current = now
        // Random delay until next ball
        nextDropDelayRef.current = MIN_DROP_DELAY + Math.random() * (MAX_DROP_DELAY - MIN_DROP_DELAY)
      }
    }

    // Get only active, non-settled balls for collision checks
    const activeBallIndices: number[] = []
    for (let i = 0; i < ballsRef.current.length; i++) {
      if (ballsRef.current[i].active) activeBallIndices.push(i)
    }

    for (let idx = 0; idx < ballsRef.current.length; idx++) {
      const ball = ballsRef.current[idx]
      // Skip dragged ball - it's controlled by mouse
      if (ball.id === dragRef.current.ballId) continue
      if (ball.settled) continue
      if (!ball.active) continue

      let { x, y, vx, vy, size } = ball
      const radius = size / 2

      vy += GRAVITY
      vx *= FRICTION
      x += vx
      y += vy

      if (y + radius >= floorY) {
        y = floorY - radius
        vy = -vy * BOUNCE_DAMPING
        vx *= 0.9
      }

      if (x - radius < 0) {
        x = radius
        vx = -vx * BOUNCE_DAMPING
      }
      if (x + radius > width) {
        x = width - radius
        vx = -vx * BOUNCE_DAMPING
      }

      // Optimized collision detection - only check active balls
      const maxDist = size + 180 // Max possible collision distance
      for (const i of activeBallIndices) {
        if (i === idx) continue
        const other = ballsRef.current[i]

        // Quick distance check before expensive sqrt
        const dx = x - other.x
        const dy = y - other.y
        if (Math.abs(dx) > maxDist || Math.abs(dy) > maxDist) continue

        const distSq = dx * dx + dy * dy
        const minDist = (size + other.size) / 2

        if (distSq < minDist * minDist && distSq > 0) {
          const distance = Math.sqrt(distSq)
          const overlap = minDist - distance
          const nx = dx / distance
          const ny = dy / distance

          x += nx * overlap * 0.5
          y += ny * overlap * 0.5

          const dvx = vx - (other.settled ? 0 : other.vx)
          const dvy = vy - (other.settled ? 0 : other.vy)
          const dvn = dvx * nx + dvy * ny

          if (dvn < 0) {
            const impulse = dvn * BOUNCE_DAMPING
            vx -= impulse * nx
            vy -= impulse * ny
          }
        }
      }

      const speed = Math.sqrt(vx * vx + vy * vy)
      const isOnFloor = y + radius >= floorY - 2

      // Simplified settle check - just check floor for most cases
      let isOnBall = false
      if (!isOnFloor && speed < SETTLE_THRESHOLD * 2) {
        for (const i of activeBallIndices) {
          if (i === idx) continue
          const other = ballsRef.current[i]
          const dx = x - other.x
          const dy = y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < (size + other.size) / 2 + 2 && y < other.y) {
            isOnBall = true
            break
          }
        }
      }

      const shouldSettle = speed < SETTLE_THRESHOLD && (isOnFloor || isOnBall)

      if (!shouldSettle) {
        hasMovement = true
      }

      ballsRef.current[idx] = {
        ...ball,
        x,
        y,
        vx: shouldSettle ? 0 : vx,
        vy: shouldSettle ? 0 : vy,
        settled: shouldSettle,
      }
    }

    // Only update React state every N frames to reduce re-renders
    if (frameCountRef.current % RENDER_INTERVAL === 0 || dragRef.current.ballId !== null) {
      setBalls([...ballsRef.current])
    }

    const hasMoreBalls = nextBallIndexRef.current < ballsRef.current.length
    const hasActiveBallsAbove = ballsRef.current.some(b => b.active && b.y < 0)
    const hasDraggedBall = dragRef.current.ballId !== null

    if (hasMovement || hasActiveBallsAbove || hasMoreBalls || hasDraggedBall) {
      requestAnimationFrame(runPhysics)
    } else {
      animatingRef.current = false
      // Final render to ensure settled state is shown
      setBalls([...ballsRef.current])
    }
  }, [])

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        containerSizeRef.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        }
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Initialize balls when data loads and handle new real-time contributions
  useEffect(() => {
    if (campaigns.length === 0 || contributions.length === 0) return

    // Use window dimensions for full viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    containerSizeRef.current = { width: viewportWidth, height: viewportHeight }

    const validContributions = contributions
      .filter((c) => getCampaign(c.campaignId || ""))
      // Sort by date ascending (oldest first, so they drop first)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    // Create a unique ID for each contribution based on name + date + amount
    const getContributionId = (c: Enabler) =>
      `${c.name}-${c.date.getTime()}-${c.amount}-${c.campaignId}`

    // Check if this is the initial load or a real-time update
    const isInitialLoad = processedContributionsRef.current.size === 0

    if (isInitialLoad) {
      // Initial load - create all balls
      const initialBalls: Ball[] = validContributions.map(
        (contribution, index) => {
          const campaign = getCampaign(contribution.campaignId || "")!
          const campaignIndex = campaigns.findIndex((c) => c.id === campaign.id)
          const contributionId = getContributionId(contribution)
          processedContributionsRef.current.add(contributionId)

          // Size based on impact (min 95px, max 180px)
          const size = Math.min(180, Math.max(95, 70 + contribution.impactUnits * 12))

          // Only first ball is active initially
          const isActive = index === 0
          const margin = size / 2 + 30

          // Random x position across viewport
          const x = margin + Math.random() * (viewportWidth - margin * 2)

          return {
            id: `ball-${contributionId}`,
            x,
            y: -size, // Start above screen
            vx: (Math.random() - 0.5) * 4, // Random horizontal velocity
            vy: 0,
            size,
            settled: false,
            active: isActive,
            isNew: false, // Initial balls are not "new"
            contribution,
            campaign,
            colorIndex: campaignIndex >= 0 ? campaignIndex % BUBBLE_COLORS.length : 0,
          }
        }
      )

      ballsRef.current = initialBalls
      setBalls(initialBalls)
    } else {
      // Real-time update - check for new contributions
      const newContributions = validContributions.filter(
        (c) => !processedContributionsRef.current.has(getContributionId(c))
      )

      if (newContributions.length > 0) {
        // Play sound for new contributions
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(() => { }) // Ignore autoplay errors
        }

        // Add new balls for new contributions
        const newBallIds: string[] = []
        const newBalls: Ball[] = newContributions.map((contribution) => {
          const campaign = getCampaign(contribution.campaignId || "")!
          const campaignIndex = campaigns.findIndex((c) => c.id === campaign.id)
          const contributionId = getContributionId(contribution)
          processedContributionsRef.current.add(contributionId)
          newBallIds.push(`ball-${contributionId}`)

          const size = Math.min(180, Math.max(95, 70 + contribution.impactUnits * 12))
          const margin = size / 2 + 30
          const x = margin + Math.random() * (viewportWidth - margin * 2)

          return {
            id: `ball-${contributionId}`,
            x,
            y: -size,
            vx: (Math.random() - 0.5) * 4,
            vy: 0,
            size,
            settled: false,
            active: true, // New real-time balls drop immediately!
            isNew: true, // Mark as new for highlight effect
            contribution,
            campaign,
            colorIndex: campaignIndex >= 0 ? campaignIndex % BUBBLE_COLORS.length : 0,
          }
        })

        // Add new balls to existing ones
        ballsRef.current = [...ballsRef.current, ...newBalls]
        setBalls([...ballsRef.current])

        // Clear "isNew" flag after 5 seconds
        setTimeout(() => {
          newBallIds.forEach((id) => {
            const ball = ballsRef.current.find((b) => b.id === id)
            if (ball) ball.isNew = false
          })
          setBalls([...ballsRef.current])
        }, 5000)

        // Restart animation if it stopped
        if (!animatingRef.current) {
          animatingRef.current = true
          requestAnimationFrame(runPhysics)
        }
      }
    }
  }, [campaigns, contributions, getCampaign, runPhysics])

  // Ball release timer
  const lastDropTimeRef = useRef(0)
  const nextDropDelayRef = useRef(0)
  const nextBallIndexRef = useRef(0)

  // Physics animation loop - start when balls are initialized
  useEffect(() => {
    if (ballsRef.current.length === 0) return
    if (animatingRef.current) return

    animatingRef.current = true
    lastDropTimeRef.current = Date.now()
    nextDropDelayRef.current = 0 // Drop first ball immediately
    nextBallIndexRef.current = 1 // First ball (index 0) is already active

    requestAnimationFrame(runPhysics)
  }, [balls.length > 0, runPhysics])

  // Global mouse/touch event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleDragEnd()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleDragMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchEnd = () => {
      handleDragEnd()
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("touchmove", handleTouchMove, { passive: false })
    window.addEventListener("touchend", handleTouchEnd)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleDragMove, handleDragEnd])

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white/60 text-lg animate-pulse">
          Loading contributions...
        </div>
      </div>
    )
  }

  const activeBalls = balls.filter(b => b.active)

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      {/* Balls */}
      {balls.map((ball) => {
        const colors = BUBBLE_COLORS[ball.colorIndex]
        const isDragging = draggedBallId === ball.id

        // Don't render inactive balls or balls above the screen
        if (!ball.active || ball.y < -ball.size) return null

        return (
          <div
            key={ball.id}
            className={`absolute ${isDragging ? 'z-50 cursor-grabbing' : 'hover:z-50 cursor-grab'}`}
            style={{
              left: 0,
              top: 0,
              width: `${ball.size}px`,
              height: `${ball.size}px`,
              transform: `translate(${ball.x - ball.size / 2}px, ${ball.y - ball.size / 2}px) scale(${isDragging ? 1.1 : 1})`,
              willChange: 'transform',
            }}
            onMouseDown={(e) => {
              e.preventDefault()
              handleDragStart(ball.id, e.clientX, e.clientY)
            }}
            onTouchStart={(e) => {
              if (e.touches.length > 0) {
                handleDragStart(ball.id, e.touches[0].clientX, e.touches[0].clientY)
              }
            }}
            onClick={(e) => {
              // Only navigate if it wasn't a drag (small movement threshold)
              const drag = dragRef.current
              const distance = Math.sqrt(
                Math.pow(e.clientX - drag.startX, 2) + Math.pow(e.clientY - drag.startY, 2)
              )
              if (distance < 10) {
                window.location.href = `/${ball.campaign.id}`
              }
            }}
          >
            <div
              className={`
                w-full h-full rounded-full
                bg-gradient-to-br ${colors.bg}
                shadow-xl ${colors.glow}
                flex flex-col items-center justify-center
                p-2 text-center
                cursor-pointer
                relative
                ${ball.isNew ? 'animate-pulse ring-4 ring-white/60' : ''}
              `}
              style={{
                boxShadow: ball.isNew
                  ? `
                    inset -4px -4px 8px rgba(0,0,0,0.3),
                    inset 4px 4px 8px rgba(255,255,255,0.1),
                    0 0 30px rgba(255,255,255,0.8),
                    0 0 60px rgba(255,255,255,0.4),
                    0 4px 20px rgba(0,0,0,0.3)
                  `
                  : `
                    inset -4px -4px 8px rgba(0,0,0,0.3),
                    inset 4px 4px 8px rgba(255,255,255,0.1),
                    0 4px 20px rgba(0,0,0,0.3)
                  `,
              }}
            >
              {/* Ball shine */}
              <div className="absolute top-2 left-3 w-1/4 h-1/4 bg-white/50 rounded-full blur-sm" />

              {/* Campaign icon */}
              <div
                className="bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0 mb-0.5"
                style={{
                  width: `${Math.max(20, ball.size * 0.18)}px`,
                  height: `${Math.max(20, ball.size * 0.18)}px`,
                }}
              >
                <Image
                  src={ball.campaign.iconPath}
                  alt={ball.campaign.title}
                  width={20}
                  height={20}
                  className="object-contain"
                  style={{
                    width: `${Math.max(12, ball.size * 0.12)}px`,
                    height: `${Math.max(12, ball.size * 0.12)}px`,
                  }}
                />
              </div>

              {/* Contributor name */}
              <p
                className="text-white font-semibold truncate w-full drop-shadow-lg leading-tight px-1"
                style={{ fontSize: `${Math.max(8, ball.size * 0.08)}px` }}
              >
                {ball.contribution.name}
              </p>

              {/* Impact */}
              <p
                className="text-white/90 drop-shadow font-medium leading-tight"
                style={{ fontSize: `${Math.max(7, ball.size * 0.07)}px` }}
              >
                {ball.contribution.impactUnits} {ball.campaign.impactItem}
                {ball.contribution.impactUnits !== 1 ? "s" : ""}
              </p>

              {/* Time */}
              <p
                className="text-white font-semibold leading-tight drop-shadow"
                style={{ fontSize: `${Math.max(9, ball.size * 0.09)}px` }}
              >
                {getTimeAgo(ball.contribution.date)}
              </p>
            </div>
          </div>
        )
      })}

      {/* Header overlay */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 flex items-center justify-between">
        <Link
          href="/"
          className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 text-white/80 text-sm hover:bg-white/20 hover:text-white transition-all"
        >
          ← Back
        </Link>

        <div className="bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/20">
          <p className="text-white/90 text-sm">
            <span className="text-white/70"> {balls.length} contributions</span>
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-20 left-0 right-0 z-40 text-center pointer-events-none">
        <h1 className="text-2xl md:text-3xl font-serif font-light text-white/90 drop-shadow-lg">
          Impact in Motion
        </h1>
        <p className="text-white/50 text-sm mt-1 flex items-center justify-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Live contributions from the last 24 hours
        </p>
      </div>
    </div>
  )
}

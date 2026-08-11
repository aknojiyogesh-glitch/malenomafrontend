import { cn } from '@/lib/utils'

export function ConfidenceRing({
  value,
  tone = 'primary',
  size = 160,
}: {
  /** confidence as a fraction 0–1 */
  value: number
  tone?: 'primary' | 'destructive' | 'success'
  size?: number
}) {
  const pct = Math.max(0, Math.min(1, value))
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dash = circumference * pct

  const toneClass =
    tone === 'destructive'
      ? 'text-destructive'
      : tone === 'success'
        ? 'text-success'
        : 'text-primary'

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Confidence ${(pct * 100).toFixed(1)} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="text-border"
          stroke="currentColor"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          className={cn('transition-[stroke-dasharray] duration-700', toneClass)}
          stroke="currentColor"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-3xl font-semibold tabular-nums">
          {(pct * 100).toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">confidence</span>
      </div>
    </div>
  )
}

import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Disclaimer({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      role="note"
      className={cn(
        'flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4',
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
      <p className="text-sm leading-relaxed text-foreground">
        {children ?? (
          <>
            <span className="font-semibold">Disclaimer:</span> This system is an AI-assisted
            screening tool for educational/research purposes and is not a substitute for
            professional medical diagnosis. Consult a qualified dermatologist for medical
            evaluation.
          </>
        )}
      </p>
    </div>
  )
}

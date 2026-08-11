import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { ConfidenceRing } from '@/components/confidence-ring'
import type { PredictionLabel } from '@/lib/types'
import { cn } from '@/lib/utils'

export function PredictionBadge({ prediction }: { prediction: PredictionLabel }) {
  const isMelanoma = prediction === 'Melanoma'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold',
        isMelanoma
          ? 'bg-destructive/10 text-destructive'
          : 'bg-success/10 text-success',
      )}
    >
      {isMelanoma ? (
        <AlertTriangle className="size-4" aria-hidden="true" />
      ) : (
        <CheckCircle2 className="size-4" aria-hidden="true" />
      )}
      {prediction}
    </span>
  )
}

export function ResultSummary({
  prediction,
  confidence,
}: {
  prediction: PredictionLabel
  confidence: number
}) {
  const isMelanoma = prediction === 'Melanoma'

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
      <ConfidenceRing value={confidence} tone={isMelanoma ? 'destructive' : 'success'} />
      <div className="flex-1 text-center sm:text-left">
        <p className="text-sm text-muted-foreground">AI Screening Result</p>
        <div className="mt-1 flex justify-center sm:justify-start">
          <PredictionBadge prediction={prediction} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {isMelanoma
            ? 'Melanoma was predicted by the AI model. Please consult a dermatologist promptly for professional examination and confirmation.'
            : 'No melanoma was detected by the AI model in this image. This result does not rule out skin cancer or other skin conditions. Consult a dermatologist if you have concerns or changing lesions.'}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Confidence reflects the model&apos;s output only and must not be interpreted as medical
          certainty.
        </p>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
  AlertCircle,
  ChevronDown,
  FileText,
  Loader2,
  RotateCcw,
  Save,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Disclaimer } from '@/components/disclaimer'
import { GradCamView } from '@/components/gradcam-view'
import { ResultSummary } from '@/components/result-summary'
import { PatientForm } from '@/components/screening/patient-form'
import { UploadBox } from '@/components/screening/upload-box'
import { saveRecord } from '@/lib/history'
import { MODEL_NAME, PredictionError, predictImage } from '@/lib/predict'
import type { PatientInfo, PredictionResponse } from '@/lib/types'

const MAX_SIZE = 10 * 1024 * 1024 // 10 MB
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png']

type Status = 'idle' | 'analyzing' | 'done'

export default function DetectionPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageDataUrl, setImageDataUrl] = useState<string>('')
  const [patient, setPatient] = useState<PatientInfo>({})
  const [showPatient, setShowPatient] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFile = useCallback(
    (next: File) => {
      setError(null)
      setResult(null)
      setStatus('idle')
      setSavedId(null)

      if (!next) {
        setError('No image selected.')
        return
      }
      if (!ACCEPTED.includes(next.type)) {
        setError('Please upload a JPG, JPEG, or PNG image.')
        return
      }
      if (next.size > MAX_SIZE) {
        setError('Image size exceeds the allowed limit (10 MB).')
        return
      }

      const reader = new FileReader()
      reader.onerror = () => setError('Unable to process this image.')
      reader.onload = () => setImageDataUrl(String(reader.result))
      reader.readAsDataURL(next)

      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(next))
      setFile(next)
    },
    [previewUrl],
  )

  const removeImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setFile(null)
    setPreviewUrl(null)
    setImageDataUrl('')
    setResult(null)
    setStatus('idle')
    setError(null)
    setSavedId(null)
  }

  const analyze = async () => {
    if (!file) {
      setError('No image selected.')
      return
    }
    if (!accepted) return
    setError(null)
    setStatus('analyzing')
    try {
      const res = await predictImage(file, patient)
      setResult(res)
      setStatus('done')
    } catch (err) {
      setStatus('idle')
      setError(
        err instanceof PredictionError
          ? err.message
          : 'Prediction service is currently unavailable. Please try again later.',
      )
    }
  }

  const persist = (): string => {
    const id = savedId ?? (globalThis.crypto?.randomUUID?.() ?? String(Date.now()))
    if (!result) return id
    saveRecord({
      id,
      createdAt: new Date().toISOString(),
      imageName: file?.name ?? 'image',
      imageDataUrl,
      prediction: result.prediction,
      confidence: result.confidence,
      heatmapUrl: result.heatmap_url ?? null,
      overlayUrl: result.overlay_url ?? null,
      model: result.model ?? MODEL_NAME,
      patient,
    })
    setSavedId(id)
    return id
  }

  const newScreening = () => removeImage()

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Upload Skin Lesion Image</h1>
        <p className="mt-2 text-muted-foreground">
          Upload a clear dermoscopic image to run an AI-assisted melanoma screening.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <UploadBox
          previewUrl={previewUrl}
          fileName={file?.name ?? null}
          onFile={handleFile}
          onRemove={removeImage}
        />

        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Optional patient info */}
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <button
            type="button"
            onClick={() => setShowPatient((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
            aria-expanded={showPatient}
          >
            <span>
              <span className="text-base font-semibold">Patient information</span>
              <span className="ml-2 text-sm text-muted-foreground">(optional)</span>
            </span>
            <ChevronDown
              className={`size-5 text-muted-foreground transition-transform ${showPatient ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {showPatient && (
            <div className="border-t border-border px-6 py-5">
              <p className="mb-4 text-sm text-muted-foreground">
                Only provide what you are comfortable sharing. Avoid unnecessary personal
                information.
              </p>
              <PatientForm value={patient} onChange={setPatient} />
            </div>
          )}
        </div>

        {/* Disclaimer acceptance */}
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 size-4 accent-primary"
          />
          <span className="text-sm leading-relaxed text-foreground">
            I understand that this tool provides AI-assisted screening and is not a medical
            diagnosis.
          </span>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-11 flex-1 text-base"
            onClick={analyze}
            disabled={!file || !accepted || status === 'analyzing'}
          >
            {status === 'analyzing' ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden="true" />
                Analyze Image
              </>
            )}
          </Button>
        </div>
        {!accepted && file && (
          <p className="-mt-3 text-xs text-muted-foreground">
            Please accept the screening acknowledgement above to enable analysis.
          </p>
        )}
      </div>

      {/* Loading */}
      {status === 'analyzing' && (
        <section className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <Loader2 className="size-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-lg font-medium">Analyzing image…</p>
          <p className="text-sm text-muted-foreground">
            Please wait while the AI model processes the image.
          </p>
        </section>
      )}

      {/* Result */}
      {status === 'done' && result && (
        <section className="mt-10 flex flex-col gap-6" aria-live="polite">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <ResultSummary prediction={result.prediction} confidence={result.confidence} />
            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const id = persist()
                  router.push(`/history/${id}`)
                }}
              >
                <FileText className="size-4" aria-hidden="true" />
                View Detailed Result
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={persist}
                disabled={Boolean(savedId)}
              >
                <Save className="size-4" aria-hidden="true" />
                {savedId ? 'Saved to History' : 'Save Result'}
              </Button>
              <Button variant="ghost" className="flex-1" onClick={newScreening}>
                <RotateCcw className="size-4" aria-hidden="true" />
                New Screening
              </Button>
            </div>
            {savedId && (
              <p className="mt-3 text-xs text-muted-foreground">
                Saved locally in your browser.{' '}
                <Link href="/history" className="text-primary hover:underline">
                  View prediction history
                </Link>
                .
              </p>
            )}
          </div>

          <GradCamView
            originalSrc={previewUrl ?? imageDataUrl}
            heatmapSrc={result.heatmap_url}
            overlaySrc={result.overlay_url}
          />

          <Disclaimer />
        </section>
      )}
    </main>
  )
}

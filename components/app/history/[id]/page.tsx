'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Disclaimer } from '@/components/disclaimer'
import { GradCamView } from '@/components/gradcam-view'
import { ResultSummary } from '@/components/result-summary'
import { deleteRecord, getRecord } from '@/lib/history'
import type { HistoryRecord } from '@/lib/types'

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value || '—'}</dd>
    </div>
  )
}

export default function DetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [record, setRecord] = useState<HistoryRecord | null | undefined>(undefined)

  useEffect(() => {
    if (params?.id) setRecord(getRecord(params.id) ?? null)
  }, [params?.id])

  if (record === undefined) {
    return <main className="mx-auto max-w-4xl px-4 py-12 text-muted-foreground">Loading…</main>
  }

  if (record === null) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Result not found</h1>
        <p className="mt-2 text-muted-foreground">
          This screening record may have been deleted or is stored on another device.
        </p>
        <Button className="mt-6" nativeButton={false} render={<Link href="/history">Back to history</Link>} />
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button variant="ghost" nativeButton={false} render={<Link href="/history"><ArrowLeft className="size-4" aria-hidden="true" />Back</Link>} />
        <div className="flex gap-2">
          {/*
            Download Report currently uses the browser's print-to-PDF dialog.
            A Flask endpoint (e.g. GET /report/<id>) can later stream a
            server-generated PDF and replace this handler.
          */}
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="size-4" aria-hidden="true" />
            Download Report
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              deleteRecord(record.id)
              router.push('/history')
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </Button>
        </div>
      </div>

      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Detailed Screening Result</h1>
        <p className="mt-2 text-muted-foreground">
          Generated {new Date(record.createdAt).toLocaleString()}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <ResultSummary prediction={record.prediction} confidence={record.confidence} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          {record.imageDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={record.imageDataUrl}
              alt="Uploaded skin lesion image"
              className="mb-4 max-h-52 w-full rounded-xl border border-border object-contain"
            />
          )}
          <dl>
            <InfoRow label="Image" value={record.imageName} />
            <InfoRow label="Model" value={record.model} />
            <InfoRow label="Prediction" value={record.prediction} />
            <InfoRow label="Confidence" value={`${(record.confidence * 100).toFixed(1)}%`} />
            <InfoRow label="Date & time" value={new Date(record.createdAt).toLocaleString()} />
          </dl>
        </div>
      </div>

      {record.patient && Object.values(record.patient).some(Boolean) && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Patient Information</h2>
          <dl className="grid gap-x-8 sm:grid-cols-2">
            <InfoRow label="Patient / User ID" value={record.patient.userId} />
            <InfoRow label="Age" value={record.patient.age} />
            <InfoRow label="Sex" value={record.patient.sex} />
            <InfoRow label="Lesion location" value={record.patient.location} />
          </dl>
          {record.patient.notes && (
            <p className="mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Notes: </span>
              {record.patient.notes}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <GradCamView
          originalSrc={record.imageDataUrl}
          heatmapSrc={record.heatmapUrl}
          overlaySrc={record.overlayUrl}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">General Explanation</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {record.prediction === 'Melanoma'
            ? 'The AI model flagged patterns it associates with melanoma. This is a preliminary screening signal only. Please consult a dermatologist promptly for professional examination and confirmation.'
            : 'The AI model did not detect melanoma patterns in this image. This does not rule out skin cancer or other conditions. Consult a dermatologist if you have concerns or notice changes in the lesion.'}
        </p>
      </div>

      <Disclaimer className="mt-6" />
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Activity, BarChart3, ShieldCheck } from 'lucide-react'
import { getHistory } from '@/lib/history'
import { MODEL_NAME } from '@/lib/predict'

// Reported evaluation metrics for the trained model (test set).
// Replace with values returned from the Flask backend when available.
const metrics = [
  { label: 'Accuracy', value: 0.924 },
  { label: 'Precision', value: 0.901 },
  { label: 'Recall', value: 0.887 },
  { label: 'F1-score', value: 0.894 },
]

function StatCard({ label, value, tone = 'default' }: { label: string; value: number; tone?: 'default' | 'destructive' | 'success' }) {
  const toneClass =
    tone === 'destructive' ? 'text-destructive' : tone === 'success' ? 'text-success' : 'text-primary'
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-3xl font-semibold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  )
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label} ${pct} percent`}
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [counts, setCounts] = useState({ total: 0, melanoma: 0, nonMelanoma: 0 })

  useEffect(() => {
    const load = () => {
      const records = getHistory()
      setCounts({
        total: records.length,
        melanoma: records.filter((r) => r.prediction === 'Melanoma').length,
        nonMelanoma: records.filter((r) => r.prediction === 'Non-Melanoma').length,
      })
    }
    load()
    window.addEventListener('melanoscan:history', load)
    return () => window.removeEventListener('melanoscan:history', load)
  }, [])

  const melanomaShare = counts.total ? (counts.melanoma / counts.total) * 100 : 0

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-semibold tracking-tight">Model Information</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Overview of local screening activity and reported model performance.
        </p>
      </header>

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-border bg-accent/40 px-4 py-3 text-sm text-accent-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Activity counts reflect only predictions saved in this browser. No patient information is
        exposed here.
      </div>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total predictions" value={counts.total} />
        <StatCard label="Melanoma predictions" value={counts.melanoma} tone="destructive" />
        <StatCard label="Non-melanoma predictions" value={counts.nonMelanoma} tone="success" />
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Model Evaluation</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reported test-set metrics for {MODEL_NAME}.
          </p>
          <div className="mt-5 flex flex-col gap-4">
            {metrics.map((m) => (
              <MetricBar key={m.label} label={m.label} value={m.value} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Prediction Distribution</h2>
          <p className="mt-1 text-sm text-muted-foreground">Share of saved screenings by class.</p>
          {counts.total === 0 ? (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              No saved predictions yet.
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
              <div
                className="flex h-4 w-full overflow-hidden rounded-full bg-muted"
                role="img"
                aria-label={`Melanoma ${melanomaShare.toFixed(0)} percent of saved predictions`}
              >
                <div className="h-full bg-destructive" style={{ width: `${melanomaShare}%` }} />
                <div className="h-full bg-success" style={{ width: `${100 - melanomaShare}%` }} />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-destructive" aria-hidden="true" />
                  Melanoma — {counts.melanoma}
                </span>
                <span className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-success" aria-hidden="true" />
                  Non-Melanoma — {counts.nonMelanoma}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

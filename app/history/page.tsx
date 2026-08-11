'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowUpDown, Eye, Search, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PredictionBadge } from '@/components/result-summary'
import { clearHistory, deleteRecord, getHistory } from '@/lib/history'
import type { HistoryRecord } from '@/lib/types'

type Filter = 'all' | 'Melanoma' | 'Non-Melanoma'

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [sortDesc, setSortDesc] = useState(true)

  useEffect(() => {
    const load = () => setRecords(getHistory())
    load()
    window.addEventListener('melanoscan:history', load)
    return () => window.removeEventListener('melanoscan:history', load)
  }, [])

  const visible = useMemo(() => {
    let list = [...records]
    if (filter !== 'all') list = list.filter((r) => r.prediction === filter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (r) =>
          r.imageName.toLowerCase().includes(q) ||
          r.prediction.toLowerCase().includes(q) ||
          (r.patient?.userId ?? '').toLowerCase().includes(q),
      )
    }
    list.sort((a, b) =>
      sortDesc
        ? a.createdAt < b.createdAt
          ? 1
          : -1
        : a.createdAt > b.createdAt
          ? 1
          : -1,
    )
    return list
  }, [records, filter, query, sortDesc])

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Prediction History</h1>
          <p className="mt-2 text-muted-foreground">
            Your saved screenings, stored locally in this browser only.
          </p>
        </div>
        {records.length > 0 && (
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Delete all saved predictions? This cannot be undone.')) clearHistory()
            }}
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Clear history
          </Button>
        )}
      </header>

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-border bg-accent/40 px-4 py-3 text-sm text-accent-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        Records are kept only on this device. Clearing your browser data removes them permanently.
      </div>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by image, prediction or user ID"
            aria-label="Search history"
            className="w-full rounded-lg border border-input bg-background py-2 pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as Filter)}
            aria-label="Filter by prediction"
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            <option value="all">All predictions</option>
            <option value="Melanoma">Melanoma</option>
            <option value="Non-Melanoma">Non-Melanoma</option>
          </select>
          <Button variant="outline" onClick={() => setSortDesc((v) => !v)}>
            <ArrowUpDown className="size-4" aria-hidden="true" />
            {sortDesc ? 'Newest' : 'Oldest'}
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-base font-medium">No predictions to show</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {records.length === 0
              ? 'Run and save a screening to see it here.'
              : 'No records match your search or filter.'}
          </p>
          <Button className="mt-5" nativeButton={false} render={<Link href="/detection">Start Screening</Link>} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium">Prediction</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((r) => (
                  <tr key={r.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {r.imageDataUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.imageDataUrl}
                            alt=""
                            className="size-9 rounded-md border border-border object-cover"
                          />
                        ) : (
                          <span className="size-9 rounded-md border border-border bg-muted" />
                        )}
                        <span className="max-w-[140px] truncate" title={r.imageName}>
                          {r.imageName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <PredictionBadge prediction={r.prediction} />
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {(r.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">Saved</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link href={`/history/${r.id}`} aria-label={`View details for ${r.imageName}`}>
                              <Eye className="size-4" aria-hidden="true" />
                              View
                            </Link>
                          }
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Delete ${r.imageName}`}
                          onClick={() => deleteRecord(r.id)}
                        >
                          <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  )
}

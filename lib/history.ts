'use client'

import type { HistoryRecord } from './types'

const STORAGE_KEY = 'melanoscan.history.v1'

/**
 * Prediction history is stored locally in the browser only. Images are kept
 * solely when the user explicitly saves a result, keeping the tool
 * privacy-conscious. Nothing is transmitted to or stored on a server here.
 */

function read(): HistoryRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as HistoryRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(records: HistoryRecord[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    window.dispatchEvent(new Event('melanoscan:history'))
  } catch {
    // storage may be full or unavailable; ignore silently
  }
}

export function getHistory(): HistoryRecord[] {
  return read().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
}

export function getRecord(id: string): HistoryRecord | undefined {
  return read().find((r) => r.id === id)
}

export function saveRecord(record: HistoryRecord) {
  const records = read().filter((r) => r.id !== record.id)
  records.push(record)
  write(records)
}

export function deleteRecord(id: string) {
  write(read().filter((r) => r.id !== id))
}

export function clearHistory() {
  write([])
}

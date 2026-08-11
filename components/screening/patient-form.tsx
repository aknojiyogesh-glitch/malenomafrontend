'use client'

import type { PatientInfo } from '@/lib/types'

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40'
const labelClass = 'text-sm font-medium'

export function PatientForm({
  value,
  onChange,
}: {
  value: PatientInfo
  onChange: (next: PatientInfo) => void
}) {
  const set = (key: keyof PatientInfo, v: string) => onChange({ ...value, [key]: v })

  return (
    <fieldset className="grid gap-4 sm:grid-cols-2">
      <legend className="sr-only">Optional patient information</legend>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="userId" className={labelClass}>
          Patient / User ID <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="userId"
          className={fieldClass}
          value={value.userId ?? ''}
          onChange={(e) => set('userId', e.target.value)}
          placeholder="e.g. P-0142"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="age" className={labelClass}>
          Age <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="age"
          type="number"
          min={0}
          max={120}
          className={fieldClass}
          value={value.age ?? ''}
          onChange={(e) => set('age', e.target.value)}
          placeholder="e.g. 45"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sex" className={labelClass}>
          Sex <span className="text-muted-foreground">(optional)</span>
        </label>
        <select
          id="sex"
          className={fieldClass}
          value={value.sex ?? ''}
          onChange={(e) => set('sex', e.target.value)}
        >
          <option value="">Prefer not to say</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="location" className={labelClass}>
          Lesion location <span className="text-muted-foreground">(optional)</span>
        </label>
        <input
          id="location"
          className={fieldClass}
          value={value.location ?? ''}
          onChange={(e) => set('location', e.target.value)}
          placeholder="e.g. Upper back"
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label htmlFor="notes" className={labelClass}>
          Notes <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="notes"
          rows={3}
          className={fieldClass}
          value={value.notes ?? ''}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Any observations about the lesion (changes, symptoms, etc.)"
        />
      </div>
    </fieldset>
  )
}

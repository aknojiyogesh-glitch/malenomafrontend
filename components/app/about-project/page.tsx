import { CheckCircle2 } from 'lucide-react'
import { Disclaimer } from '@/components/disclaimer'

const meta = [
  { label: 'Domain', value: 'Artificial Intelligence / Deep Learning / Computer Vision / Healthcare' },
  { label: 'Dataset', value: 'HAM10000' },
  { label: 'Model', value: 'EfficientNetB0 / CNN-based transfer learning' },
  { label: 'Classification', value: 'Melanoma vs Non-Melanoma' },
]

const tech = ['Python', 'TensorFlow / Keras', 'EfficientNetB0', 'OpenCV', 'Flask', 'HTML / CSS / JavaScript']

const objectives = [
  'Assist early screening of skin lesions',
  'Analyze dermoscopic images with deep learning',
  'Provide AI-assisted predictions',
  'Display confidence scores',
  'Provide explainable AI visualization (Grad-CAM)',
]

export default function AboutProjectPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-medium text-primary">Final-year major project</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-balance">
          AI-Based Early Melanoma Detection System using Deep Learning
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          A research prototype that applies convolutional neural networks and transfer learning to
          the task of preliminary melanoma screening from dermoscopic images.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <section className="grid gap-3 sm:grid-cols-2">
          {meta.map((m) => (
            <div key={m.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {m.label}
              </p>
              <p className="mt-1 text-sm font-medium">{m.value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Technology stack</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tech.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-sm font-medium"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Project objectives</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {objectives.map((o) => (
              <li key={o} className="flex items-start gap-2.5 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                <span className="leading-relaxed">{o}</span>
              </li>
            ))}
          </ul>
        </section>

        <Disclaimer />
      </div>
    </main>
  )
}

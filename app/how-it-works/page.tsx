import Link from 'next/link'
import { Brain, ImageUp, LineChart, ScanSearch, Sliders } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Disclaimer } from '@/components/disclaimer'

const steps = [
  {
    icon: ImageUp,
    title: 'Upload Image',
    text: 'You provide a dermoscopic image of a skin lesion in JPG, JPEG or PNG format. The image stays on your device unless you choose to save the result.',
  },
  {
    icon: Sliders,
    title: 'Image Preprocessing',
    text: 'The image is resized, normalized and cleaned so it matches the format the model expects. This makes predictions more consistent across different cameras and lighting.',
  },
  {
    icon: ScanSearch,
    title: 'Feature Extraction',
    text: 'A convolutional neural network extracts visual features — patterns of color, texture, border and shape that are relevant to distinguishing lesions.',
  },
  {
    icon: Brain,
    title: 'Deep Learning Classification',
    text: 'A transfer-learning model based on EfficientNetB0 evaluates the extracted features and estimates whether the lesion resembles melanoma or non-melanoma.',
  },
  {
    icon: LineChart,
    title: 'Prediction & Confidence Score',
    text: 'The system returns a prediction and a confidence score, plus — when available — a Grad-CAM heatmap showing which regions most influenced the result.',
  },
]

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">How It Works</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground text-pretty">
          MelanoScan turns a single dermoscopic image into an AI-assisted screening result in five
          clear stages. The model uses a CNN / transfer-learning architecture such as
          EfficientNetB0.
        </p>
      </header>

      <ol className="relative">
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
            {i < steps.length - 1 && (
              <span
                className="absolute top-12 left-6 h-[calc(100%-2rem)] w-px bg-border"
                aria-hidden="true"
              />
            )}
            <span className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <step.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-lg font-semibold">{step.title}</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <Disclaimer />
      </div>

      <div className="mt-8 flex justify-center">
        <Button size="lg" nativeButton={false} className="h-11 px-6 text-base" render={<Link href="/detection">Start Screening</Link>} />
      </div>
    </main>
  )
}

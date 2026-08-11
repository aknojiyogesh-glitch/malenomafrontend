import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Brain, Gauge, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Disclaimer } from '@/components/disclaimer'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Deep learning-based image analysis of dermoscopic skin lesions.',
  },
  {
    icon: Gauge,
    title: 'Fast Screening',
    description: 'Receive a prediction within seconds of uploading an image.',
  },
  {
    icon: Sparkles,
    title: 'Explainable Results',
    description:
      'View confidence and, when available, an AI attention/heatmap visualization.',
  },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Preliminary screening assistance
            </span>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              AI-Assisted Early Melanoma Screening
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground text-pretty">
              Analyze dermoscopic skin lesion images using deep learning to identify suspicious
              melanoma patterns.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                nativeButton={false}
                className="h-11 px-5 text-base"
                render={
                  <Link href="/detection">
                    Start Screening
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />
              <Button
                variant="outline"
                size="lg"
                nativeButton={false}
                className="h-11 px-5 text-base"
                render={<Link href="/how-it-works">How It Works</Link>}
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Not a medical diagnosis. Always consult a dermatologist.
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <Image
                src="/images/hero-illustration.png"
                alt="Illustration of an AI system analyzing a dermoscopic skin lesion image"
                width={720}
                height={720}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <feature.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow strip */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <h2 className="text-2xl font-semibold tracking-tight text-balance">
                From image to insight in a few clear steps
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Upload a dermoscopic image, let the model analyze it, and review a prediction with a
                confidence score and optional attention visualization.
              </p>
              <Button
                variant="outline"
                nativeButton={false}
                className="mt-5"
                render={
                  <Link href="/how-it-works">
                    See the full process
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                }
              />
            </div>
            <ol className="flex flex-wrap gap-3 md:max-w-sm">
              {['Upload', 'Preprocess', 'Extract', 'Classify', 'Predict'].map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary font-mono text-[11px] text-primary-foreground">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Disclaimer />
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ScanSearch className="size-4 text-primary" aria-hidden="true" />
          Ready to begin?
          <Link href="/detection" className="font-medium text-primary hover:underline">
            Start a screening
          </Link>
        </div>
      </section>
    </main>
  )
}

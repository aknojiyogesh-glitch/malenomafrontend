import Link from 'next/link'
import { ScanSearch } from 'lucide-react'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ScanSearch className="size-4" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">MelanoScan</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              An AI-assisted melanoma screening prototype for educational and research use.
              MelanoScan does not provide a medical diagnosis.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm">
            <Link href="/detection" className="text-muted-foreground hover:text-foreground">
              Melanoma Detection
            </Link>
            <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground">
              How It Works
            </Link>
            <Link href="/about-melanoma" className="text-muted-foreground hover:text-foreground">
              About Melanoma
            </Link>
            <Link href="/history" className="text-muted-foreground hover:text-foreground">
              Prediction History
            </Link>
            <Link href="/about-project" className="text-muted-foreground hover:text-foreground">
              About Project
            </Link>
            <Link href="/admin" className="text-muted-foreground hover:text-foreground">
              Model Information
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span> This system is an
            AI-assisted screening tool for educational/research purposes and is not a substitute for
            professional medical diagnosis. Always consult a qualified dermatologist for medical
            evaluation.
          </p>
        </div>
      </div>
    </footer>
  )
}

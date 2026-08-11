import { ImageOff, Layers } from 'lucide-react'

function Tile({
  label,
  src,
  alt,
}: {
  label: string
  src?: string | null
  alt: string
}) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="relative aspect-square w-full bg-muted">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center text-muted-foreground">
            <ImageOff className="size-6" aria-hidden="true" />
            <span className="text-xs leading-relaxed">
              Awaiting heatmap from the model backend
            </span>
          </div>
        )}
      </div>
      <figcaption className="border-t border-border px-3 py-2 text-center text-xs font-medium text-muted-foreground">
        {label}
      </figcaption>
    </figure>
  )
}

export function GradCamView({
  originalSrc,
  heatmapSrc,
  overlaySrc,
}: {
  originalSrc: string
  heatmapSrc?: string | null
  overlaySrc?: string | null
}) {
  const hasHeatmap = Boolean(heatmapSrc || overlaySrc)

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <Layers className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">AI Attention Visualization</h2>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The heatmap highlights image regions that contributed most strongly to the model&apos;s
        prediction. It is provided for interpretability and does not represent a medical diagnosis.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Tile label="Original Image" src={originalSrc} alt="Uploaded skin lesion image" />
        <Tile label="Grad-CAM Heatmap" src={heatmapSrc} alt="Grad-CAM attention heatmap" />
        <Tile label="Overlay" src={overlaySrc} alt="Heatmap overlaid on the original image" />
      </div>

      {!hasHeatmap && (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
          Grad-CAM output is not available for this prediction yet. When the Flask backend returns a{' '}
          <code className="font-mono">heatmap_url</code> (and optional overlay), the visualizations
          will appear here automatically.
        </p>
      )}
    </section>
  )
}

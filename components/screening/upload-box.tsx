'use client'

import { useRef, useState } from 'react'
import { ImagePlus, UploadCloud, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function UploadBox({
  previewUrl,
  fileName,
  onFile,
  onRemove,
}: {
  previewUrl: string | null
  fileName: string | null
  onFile: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files: FileList | null) => {
    if (files && files[0]) onFile(files[0])
  }

  if (previewUrl) {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={fileName ? `Preview of ${fileName}` : 'Uploaded image preview'}
            className="mx-auto max-h-[360px] w-full object-contain"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="truncate text-sm text-muted-foreground" title={fileName ?? undefined}>
            {fileName}
          </p>
          <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="size-4" aria-hidden="true" />
            Upload another image
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card px-6 py-14 text-center transition-colors',
        dragging ? 'border-primary bg-accent/40' : 'border-border',
      )}
    >
      <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <UploadCloud className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-4 text-base font-medium">Drag and drop an image here</p>
      <p className="mt-1 text-sm text-muted-foreground">JPG, JPEG or PNG — up to 10 MB</p>
      <Button className="mt-5" size="lg" onClick={() => inputRef.current?.click()}>
        Browse files
      </Button>
      <p className="mt-4 text-xs text-muted-foreground">Recommended: clear dermoscopic image</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

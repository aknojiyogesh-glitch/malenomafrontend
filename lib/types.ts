export type PredictionLabel = 'Melanoma' | 'Non-Melanoma'

export interface PatientInfo {
  userId?: string
  age?: string
  sex?: string
  location?: string
  notes?: string
}

export interface PredictionResponse {
  prediction: PredictionLabel
  /** Confidence as a fraction between 0 and 1, e.g. 0.946 */
  confidence: number
  /** Optional Grad-CAM heatmap image URL returned by the backend */
  heatmap_url?: string | null
  /** Optional overlay image URL returned by the backend */
  overlay_url?: string | null
  /** Optional model name returned by the backend */
  model?: string
}

export interface HistoryRecord {
  id: string
  createdAt: string
  imageName: string
  /** Data URL of the uploaded image (only stored when the user chooses to save) */
  imageDataUrl: string
  prediction: PredictionLabel
  confidence: number
  heatmapUrl?: string | null
  overlayUrl?: string | null
  model: string
  patient?: PatientInfo
}

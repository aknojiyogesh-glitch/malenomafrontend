import type { PatientInfo, PredictionResponse } from './types'

export const MODEL_NAME = 'EfficientNetB0 (transfer learning)'

/** Human-readable error thrown by the prediction client. */
export class PredictionError extends Error {}

/**
 * Sends the uploaded image to the Flask backend.
 *
 * Backend contract:
 *   POST /predict
 *   Content-Type: multipart/form-data
 *   Field: image = <uploaded file>
 *
 * Expected JSON response:
 *   { "prediction": "Melanoma", "confidence": 0.946, "heatmap_url": "/static/results/heatmap.jpg" }
 *
 * Configure the backend base URL via NEXT_PUBLIC_PREDICT_API_URL.
 * When it is not set, a simulated prediction is returned so the UI stays
 * fully functional as a prototype. No results are hard-coded for real runs.
 */
export async function predictImage(
  file: File,
  patient?: PatientInfo,
): Promise<PredictionResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_PREDICT_API_URL

  if (!baseUrl) {
    return simulatePrediction(file)
  }

  const formData = new FormData()
  formData.append('image', file)
  if (patient) {
    Object.entries(patient).forEach(([key, value]) => {
      if (value) formData.append(key, String(value))
    })
  }

  let res: Response
  try {
    res = await fetch(`${baseUrl.replace(/\/$/, '')}/predict`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new PredictionError(
      'Prediction service is currently unavailable. Please try again later.',
    )
  }

  if (!res.ok) {
    throw new PredictionError('Unable to process this image. Please try again later.')
  }

  let data: PredictionResponse
  try {
    data = (await res.json()) as PredictionResponse
  } catch {
    throw new PredictionError('Unable to process this image. Please try again later.')
  }

  if (!data || typeof data.confidence !== 'number' || !data.prediction) {
    throw new PredictionError('Unable to process this image. Please try again later.')
  }

  return data
}

/**
 * Deterministic client-side placeholder used only when no backend is
 * configured. It derives a pseudo-random but stable result from the file so
 * the demo behaves consistently. This is NOT a real prediction.
 */
async function simulatePrediction(file: File): Promise<PredictionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 2200))

  let hash = 0
  const seed = `${file.name}-${file.size}`
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  }

  const isMelanoma = hash % 2 === 0
  const confidence = 0.72 + ((hash % 260) / 1000) // 0.72 – 0.98

  return {
    prediction: isMelanoma ? 'Melanoma' : 'Non-Melanoma',
    confidence: Number(confidence.toFixed(3)),
    heatmap_url: null,
    overlay_url: null,
    model: MODEL_NAME,
  }
}

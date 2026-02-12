export interface PredictionRequest {
  distance: number;
  carrier_id: number;
  is_weekend: boolean;
}

export interface PredictionResult {
  hours: number;
  days: number;
  status: "On Track" | "Delayed";
  confidence_score?: number;
}
import { useState } from "react";
import { logisticsService } from "@/services/api";
import { PredictionRequest, PredictionResult } from "@/types";
import { toast } from "sonner"; 

export function usePrediction() {
  const [data, setData] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const predict = async (request: PredictionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await logisticsService.predictDelivery(request);
      setData(result);
      toast.success("Calculation complete!");
    } catch (err) {
      setError("Failed to connect to the AI Engine.");
      toast.error("Prediction failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setData(null);

  return { data, loading, error, predict, reset };
}
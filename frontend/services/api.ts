import { PredictionRequest, PredictionResult } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";


export interface BatchResult {
  filename: string;
  total_rows: number;
  data: Array<{
    distance: number;
    carrier_id: number;
    is_weekend: boolean;
    predicted_hours: number;
    status: string;
  }>;
}


export const logisticsService = {
  async predictDelivery(data: PredictionRequest): Promise<PredictionResult> {
    const response = await fetch(`${API_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prediction");
    }
    return await response.json();
  },

  async uploadBatch(file: File): Promise<BatchResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/batch-predict`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Batch upload failed");
    }

    return response.json();
  },
};
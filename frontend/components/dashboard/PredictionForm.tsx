"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Truck } from "lucide-react";
import { PredictionRequest } from "@/types";

interface Props {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}

export function PredictionForm({ onSubmit, isLoading }: Props) {
  const [formData, setFormData] = useState<PredictionRequest>({
    distance: 0,
    carrier_id: 0,
    is_weekend: false,
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" /> Shipment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              placeholder="e.g. 450"
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Carrier</Label>
            <Select onValueChange={(val) => setFormData({ ...formData, carrier_id: parseInt(val) })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Aras Cargo</SelectItem>
                <SelectItem value="1">MNG Kargo</SelectItem>
                <SelectItem value="2">Yurtiçi Kargo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="weekend">Weekend Delivery?</Label>
            <Switch
              id="weekend"
              checked={formData.is_weekend}
              onCheckedChange={(checked) => setFormData({ ...formData, is_weekend: checked })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Calculate Prediction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { usePrediction } from "@/hooks/usePrediction";
import { PredictionForm } from "@/components/dashboard/PredictionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CsvUploader } from '@/components/dashboard/CsvUploader'

export default function DashboardPage() {
  const { data, loading, predict } = usePrediction();

  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl space-y-12">
      <section className='border-t p-10'>
 <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Logistics AI Engine</h1>
        <p className="text-muted-foreground">Real-time delivery estimation powered by PyTorch.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column: Input */}
        <div className="space-y-6">
          <PredictionForm onSubmit={predict} isLoading={loading} />
        </div>

        {/* Right Column: Output */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col justify-center items-center text-center">
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {!data ? (
                <div className="text-muted-foreground text-sm">
                  Waiting for shipment data...
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <Badge variant={data.status === "On Track" ? "default" : "destructive"} className="text-md px-3 py-1">
                    {data.status}
                  </Badge>
                  <div>
                    <span className="text-6xl font-extrabold tracking-tighter">
                      {data.hours}
                      <span className="text-2xl text-muted-foreground font-medium">h</span>
                    </span>
                    <p className="text-muted-foreground mt-2">
                      Estimated ~{data.days} Days
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>        
      </section>
      <section className="border-t pt-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Batch Analysis</h2>
          <p className="text-muted-foreground">Upload your shipping logs to optimize routes at scale.</p>
        </div>
        <CsvUploader />
      </section>
      
    </main>
  );
}
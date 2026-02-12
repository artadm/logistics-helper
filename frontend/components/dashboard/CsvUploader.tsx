"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { logisticsService, BatchResult } from "@/services/api";
import { toast } from "sonner";

export function CsvUploader() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<BatchResult | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      toast.info("Uploading & Analyzing...");
      const data = await logisticsService.uploadBatch(file);
      setResults(data);
      toast.success(`Processed ${data.total_rows} shipments!`);
    } catch (err) {
      toast.error("Failed to process file. Check CSV format.");
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-6">
      {/* 1. Drop Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300"}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-slate-100 rounded-full">
            <UploadCloud className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-700">
              {isDragActive ? "Drop the CSV here..." : "Click to upload or drag & drop"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Supports .csv (max 5MB)
            </p>
          </div>
        </div>
      </div>

      {/* 2. Analysis Results Preview */}
      {results && (
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-green-600" />
                <span className="font-semibold">{results.filename}</span>
              </div>
              <span className="text-sm text-slate-500">{results.total_rows} Rows Processed</span>
            </div>

            <div className="bg-slate-50 rounded-lg overflow-hidden border">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 text-slate-600 font-medium border-b">
                  <tr>
                    <th className="p-3">Dist. (km)</th>
                    <th className="p-3">Carrier</th>
                    <th className="p-3">Prediction</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {results.data.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-100/50">
                      <td className="p-3">{row.distance}</td>
                      <td className="p-3">
                         {["Aras", "MNG", "Yurtiçi"][row.carrier_id] || "Unknown"}
                      </td>
                      <td className="p-3 font-medium">{row.predicted_hours.toFixed(1)}h</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          row.status === "On Track" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t">
                Showing first 5 of {results.total_rows} rows
              </div>
            </div>
            
            <Button className="w-full mt-4" variant="outline">
              Download Full Report
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
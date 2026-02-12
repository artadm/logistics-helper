from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from engine import ModelHandler
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from fastapi import UploadFile, File
import io

app = FastAPI(title="Logistics AI Engine")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


# Initialize the model once when the server starts
handler = ModelHandler("model.pth")

class PredictionRequest(BaseModel):
    distance: float
    carrier_id: int
    is_weekend: bool

@app.get("/")
def health_check():
    return {"status": "online", "model": "DeliveryPredictor_v1"}

@app.post("/predict")
async def predict_delivery(request: PredictionRequest):
    try:
        # Business logic: basic validation
        if request.distance < 0:
            raise ValueError("Distance cannot be negative")
            
        result = handler.predict(
            request.distance, 
            request.carrier_id, 
            request.is_weekend
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@app.post("/batch-predict")
async def batch_predict(file: UploadFile = File(...)):
    # 1. Read the uploaded file into a Pandas DataFrame
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # 2. Validation: Check if required columns exist
    required_cols = ['distance', 'carrier_id', 'is_weekend']
    if not all(col in df.columns for col in required_cols):
        return {"error": f"CSV must contain columns: {required_cols}"}

    # 3. Run Predictions in a Loop (or Vectorized)
    results = []
    
    # We iterate for simplicity, but vectorization is faster for huge files
    for index, row in df.iterrows():
        prediction = handler.predict(
            distance=row['distance'],
            carrier_id=int(row['carrier_id']),
            is_weekend=bool(row['is_weekend'])
        )
        # Add result back to the row data
        results.append({
            **row.to_dict(), 
            "predicted_hours": prediction['hours'],
            "status": prediction['status']
        })

    # 4. Return the enriched data
    return {
        "filename": file.filename,
        "total_rows": len(results),
        "data": results
    }
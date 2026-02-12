import torch
import torch.nn as nn

class DeliveryPredictor(nn.Module):
    def __init__(self):
        super(DeliveryPredictor, self).__init__()
        self.layer1 = nn.Linear(3, 16)
        self.layer2 = nn.Linear(16, 8)
        self.output = nn.Linear(8, 1)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        return self.output(x)

class ModelHandler:
    def __init__(self, model_path="model.pth"):
        self.model = DeliveryPredictor()
        # Load weights safely
        self.model.load_state_dict(torch.load(model_path, weights_only=True))
        self.model.eval()

    def predict(self, distance: float, carrier_id: int, is_weekend: bool):
        # Prepare the input tensor
        input_tensor = torch.tensor([[distance, carrier_id, int(is_weekend)]], dtype=torch.float32)
        
        with torch.no_grad():
            raw_prediction = self.model(input_tensor).item()
            
        # Return a dictionary of formatted results
        return {
            "hours": round(raw_prediction, 2),
            "days": round(raw_prediction / 24, 1),
            "status": "Delayed" if raw_prediction > 48 else "On Track"
        }
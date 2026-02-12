import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from engine import DeliveryPredictor # Import your architecture

def train():
    # 1. Create Synthetic Data (Distance, CarrierID, IsWeekend)
    # Let's pretend: Carrier 0 is slow, 1 is medium, 2 is fast
    np.random.seed(42)
    X = np.random.rand(1000, 3) 
    X[:, 0] *= 1000  # Scale distance to 0-1000km
    X[:, 1] = np.random.randint(0, 3, 1000) # Carrier 0, 1, or 2
    X[:, 2] = np.random.randint(0, 2, 1000) # 0 or 1 for weekend

    # Target (Hours): Distance/50 + Carrier_Penalty + Weekend_Penalty
    y = (X[:, 0] / 50) + (X[:, 1] * 5) + (X[:, 2] * 12) + np.random.normal(0, 2, 1000)
    
    X_train = torch.tensor(X, dtype=torch.float32)
    y_train = torch.tensor(y, dtype=torch.float32).view(-1, 1)

    # 2. Setup Model
    model = DeliveryPredictor()
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    criterion = nn.MSELoss()

    # 3. Training Loop
    print("Starting training...")
    for epoch in range(500):
        optimizer.zero_grad()
        outputs = model(X_train)
        loss = criterion(outputs, y_train)
        loss.backward()
        optimizer.step()
        
        if epoch % 100 == 0:
            print(f"Epoch {epoch}, Loss: {loss.item():.4f}")

    # 4. Save the Weights
    torch.save(model.state_dict(), "model.pth")
    print("Training complete. model.pth created.")

if __name__ == "__main__":
    train()
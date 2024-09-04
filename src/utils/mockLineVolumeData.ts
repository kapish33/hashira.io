interface StockData {
    value: number;
    volume: number;
  }
  
  // Function to generate an array of stock data with a general upward trend
  export function generateStockDataArray(length: number): StockData[] {
    const data: StockData[] = [];
  
    // Initialize the first stock value around a base value (e.g., 64000)
    let previousValue = 64000 + Math.random() * 500;
  
    for (let i = 0; i < length; i++) {
      // Simulate a general upward trend with some daily fluctuations
      const dailyChangePercent = (Math.random() - 0.4) * 2; // Bias towards a small positive change
      const value = parseFloat(
        (previousValue * (1 + dailyChangePercent / 100)).toFixed(2)
      );
  
      // Add occasional larger fluctuations to simulate real market events
      if (Math.random() < 0.05) {
        // 5% chance for a larger market event
        const largerChangePercent = (Math.random() - 0.5) * 10; // Fluctuation between -5% and +5%
        previousValue = parseFloat(
          (value * (1 + largerChangePercent / 100)).toFixed(2)
        );
      } else {
        previousValue = value;
      }
  
      // Generate a volume with some random variability
      const volume = Math.floor(Math.random() * 15000 + 10000); // Volume between 10000 and 25000
  
      data.push({ value: previousValue, volume });
    }
  
    return data;
  }
  
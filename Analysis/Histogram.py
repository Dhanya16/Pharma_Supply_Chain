import pandas as pd
import matplotlib.pyplot as plt

# Example DataFrame with block data
df = pd.DataFrame({
    'block_number': [1234567, 1234568, 1234569],
    'gas_used': [21000, 30000, 25000],
    'gas_limit': [8000000, 8000000, 8000000],
    'transaction_count': [10, 12, 8]
})
plt.hist(df['transaction_count'], bins=5)
plt.xlabel('Transaction Count')
plt.ylabel('Frequency')
plt.title('Distribution of Transaction Count per Block')
plt.show()

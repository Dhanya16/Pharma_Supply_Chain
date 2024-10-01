import pandas as pd
import matplotlib.pyplot as plt

# Example DataFrame with block data
df = pd.DataFrame({
    'block_number': [1234567, 1234568, 1234569],
    'gas_used': [21000, 30000, 25000],
    'gas_limit': [8000000, 8000000, 8000000],
    'transaction_count': [10, 12, 8]
})

# Line plot
plt.plot(df['block_number'], df['gas_used'], label='Gas Used')
plt.plot(df['block_number'], df['gas_limit'], label='Gas Limit', linestyle='--')
plt.xlabel('Block Number')
plt.ylabel('Gas')
plt.title('Gas Used and Gas Limit per Block')
plt.legend()
plt.show()

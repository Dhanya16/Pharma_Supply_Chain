import plotly.express as px
import pandas as pd
from web3 import Web3

# Connect to Ganache on localhost at port 7545
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

# Check if connection is successful
if not w3.is_connected():
    print("Failed to connect to Ganache")
else:
    print("Connected to Ganache")

# Example DataFrame with block data
df = pd.DataFrame({
    'block_number': [1234567, 1234568, 1234569],
    'gas_used': [21000, 30000, 25000],
    'gas_limit': [8000000, 8000000, 8000000],
    'transaction_count': [10, 12, 8]
})

# Plot with Plotly
fig = px.line(df, x='block_number', y='gas_used', title='Gas Used per Block')

# Save the plot as an HTML file
fig.write_html("plot.html")

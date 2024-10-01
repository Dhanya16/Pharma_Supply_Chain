# Cell1
# from web3 import Web3

# # Connect to Ganache on localhost
# w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

# # Check if connection is successful
# if w3.is_connected():
#     print("Connected to Ganache")
# else:
#     print("Failed to connect")

# Cell2
from web3 import Web3
import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px
# Connect to Infura or Local Node
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:7545'))

# Fetch block details
j=121
gas_used=[]
gas_limit=[]
block_size=[]
transaction_count=[]
for i in range(3):
    if i==0:
        block_number = 105
    else:
        block_number = j  # Replace with the block number you want to analyze
    block = w3.eth.get_block(block_number)

    # Block metrics
    gas_used.append(block['gasUsed'])
    gas_limit.append(block['gasLimit'])
    block_size.append(block['size'])
    transaction_count.append(len(block['transactions']))



print(f"Gas Used: {gas_used}, Gas Limit: {gas_limit}, Block Size: {block_size}, Transactions: {transaction_count}")
df = pd.DataFrame({
    'block_number': [105, 121, 122],
    'gas_used': gas_used,
    'gas_limit': gas_limit,
    'transaction_count': transaction_count
})

# Line plot
# plt.plot(df['block_number'], df['gas_used'], label='Gas Used')
# plt.plot(df['block_number'], df['gas_limit'], label='Gas Limit', linestyle='--')
# plt.xlabel('Block Number')
# plt.ylabel('Gas')
# plt.title('Gas Used and Gas Limit per Block')
# plt.legend()
# plt.show()

# plt.hist(df['transaction_count'], bins=5)
# plt.xlabel('Transaction Count')
# plt.ylabel('Frequency')
# plt.title('Distribution of Transaction Count per Block')
# plt.show()

# Plot with Plotly
fig = px.line(df, x='block_number', y='gas_used', title='Gas Used per Block')

# Save the plot as an HTML file
fig.write_html("plot.html")

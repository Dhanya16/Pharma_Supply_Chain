import matplotlib.pyplot as plt
import numpy as np
from matplotlib import cm

# Example values
values = [0, 0.000644927502063768, 0.0018542500059336, 0.000958922503068552, 0.000810565002593808, 
          0.010291305032932176, 0.0032768, 0.00109961, 0.00104304, 0.00282496, 
          0.0010988, 0.00126923, 0.00321964, 0.00322012, 0.00321916, 
          0.00321964, 0.00319138, 0.00367596, 0.00318978, 0.00321202, 
          0.00368022, 0.00503784]

# Calculating cost for each transaction
initial_cost = 100
costs = []
for i in range(22):
    val = initial_cost - values[i]
    costs.append(val)
    initial_cost = val

# X and Y axis values
xaxis = list(range(22))
yaxis = [99.93, 99.94, 99.95, 99.96, 99.97, 99.98, 99.99, 100]

# Create the figure with dark background
fig, ax = plt.subplots(figsize=(12, 7))
fig.patch.set_facecolor('#0e1a25')  # Dark bluish background
ax.set_facecolor('#1c2938')  # Lighter background for the plot area

# Gradient for the bars
colors = cm.Blues(np.linspace(0.4, 1, len(xaxis)))

# Bar chart for the transactions with gradient effect
bars = ax.bar(xaxis, costs, color=colors, alpha=0.9, label='Transaction Bars')

# Line plot for cost trend with stylish color
plt.plot(xaxis, costs, marker='o', linestyle='-', color='#fc4f30', linewidth=3, label='Cost Trend')

# Annotate negative values, skipping the first value
for i, txt in enumerate(values):
    if txt == 0:
        continue  # Skip annotation for the first value (0)
    if i % 2 == 0:  # Alternate between left and right annotations
        ax.annotate(f'-{txt:.6f}', (xaxis[i], costs[i]), textcoords="offset points", xytext=(5, -20), 
                    ha='right', color='white', fontsize=10, family='serif')
    else:
        ax.annotate(f'-{txt:.6f}', (xaxis[i], costs[i]), textcoords="offset points", xytext=(10, 5), 
                    ha='left', color='white', fontsize=10, family='serif')

# Title and labels with stylish fonts
plt.title('Cost Over Transactions', fontsize=20, color='white', family='serif')
plt.xlabel('Transactions', fontsize=15, color='white', family='serif')
plt.ylabel('Cost', fontsize=15, color='white', family='serif')
plt.ylim(99.93, 100)
plt.xticks(xaxis, fontsize=12, color='white', family='serif')
plt.yticks(yaxis, fontsize=12, color='white', family='serif')

# Add a grid with a fine dashed style for readability
plt.grid(True, which='both', color='white', linestyle='--', linewidth=0.6)

# Remove the top and right border (for modern aesthetic)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)

# Tight layout for better spacing
plt.tight_layout()

# Show the plot
plt.show()

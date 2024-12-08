import matplotlib.pyplot as plt
import numpy as np

# Data
labels = ['PharmaSupplyChain', 'AddDrug', 'AddCategory', 'BoxAccessControl', 'DrugLifecycle']
eth_values = [0.000644927502063768, 0.0018542500059336, 0.000958922503068552, 0.000810565002593808, 0.010291305032932176]

# Custom ticks and their positions
custom_ticks = [0.000, 0.0004, 0.0008, 0.0012, 0.0016, 0.002, 0.004, 0.006, 0.008, 0.01, 0.012]
# Create a range of equally spaced tick positions to map them
y_tick_positions = np.linspace(0, 1, len(custom_ticks))

# Normalize eth_values relative to the custom ticks
def normalize(value, custom_ticks):
    # Find the range within which the value falls
    for i in range(len(custom_ticks) - 1):
        if custom_ticks[i] <= value <= custom_ticks[i + 1]:
            # Normalize between the corresponding tick positions
            return (y_tick_positions[i] +
                    (y_tick_positions[i + 1] - y_tick_positions[i]) *
                    (value - custom_ticks[i]) / (custom_ticks[i + 1] - custom_ticks[i]))
    return 1  # Return max position for values beyond the last tick

# Normalize the ETH values based on custom tick points
eth_values_normalized = [normalize(v, custom_ticks) for v in eth_values]

# Blue gradient color palette
blue_colors = ['#b3cde0', '#6497b1', '#005b96', '#03396c', '#011f4b']

# White background color
background_color = '#fff'

# Set font family to serif
plt.rc('font', family='serif')

# Create the plot
plt.figure(figsize=(10, 6), facecolor=background_color)
ax = plt.gca()
ax.set_facecolor(background_color)

# Plot bars using the normalized eth_values with reduced width
bar_width = 0.4  # Set a narrower width for the bars
bars = plt.bar(labels, eth_values_normalized, color=blue_colors, edgecolor='white', width=bar_width)

# Add labels and title
plt.title('Gas Costs (in ETH) for Contract Creation', fontsize=14, color='black')
plt.xlabel('Contracts', fontsize=12, color='black')
plt.ylabel('ETH', fontsize=12, color='black')

# Adjust the color of the tick labels
ax.tick_params(axis='x', colors='black')
ax.tick_params(axis='y', colors='black')

# Show actual values on bars with bold white font
for bar, value in zip(bars, eth_values):
    plt.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.0001, f'{value:.6f}',
             ha='center', fontsize=11, color='white', fontweight='bold')

# Set custom y-axis ticks and their positions
ax.set_yticks(y_tick_positions)  # Display custom tick positions
ax.set_yticklabels(custom_ticks)  # Label them with the custom tick values

# Add red horizontal lines at 0.002
line_positions = [0.002]  # Points to add horizontal lines

# Add the lines at each position
for pos in line_positions:
    plt.axhline(y=normalize(pos, custom_ticks), color='red', linestyle='--', linewidth=1.5)

# Show the plot with tight layout
plt.tight_layout()
plt.show()

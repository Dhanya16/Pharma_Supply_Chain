document.addEventListener('DOMContentLoaded', () => {
    // Load existing drugs when the DOM is fully loaded
    loadDrugs();

    // Event listener for adding new drug
    // Event listener for adding new drug
    document.querySelector('#addNewDrugModal form').addEventListener('submit', async function (e) {
        e.preventDefault();

        // Collecting form data
        const formData = new FormData();
        formData.append('item_name', document.getElementById('new-drug-name').value);
        formData.append('batch_number', document.getElementById('new-batch-number').value);
        formData.append('price', document.getElementById('new-drug-price').value);
        formData.append('category', document.getElementById('new-drug-category').value);
        formData.append('manufacturing_date', document.getElementById('new-manufacturing-date').value);
        formData.append('expiry_date', document.getElementById('new-expiry-date').value);
        formData.append('description', document.getElementById('new-drug-description').value);

        // Append the image file (file input element)
        const drugImageFile = document.getElementById('new-drug-image').files[0];
        if (drugImageFile) {
            formData.append('drug_image', drugImageFile);
        }

        const response = await fetch('http://localhost:5000/api/addNewDrug', {
            method: 'POST',
            body: formData // No need to set headers, FormData handles that
        });

        if (response.ok) {
            const newDrug = await response.json();
            addDrugToTable(newDrug);
            document.querySelector('#addNewDrugModal form').reset(); // Clear input fields
        } else {
            const error = await response.text();
            alert(`Error adding drug: ${error}`);
        }
    });
// Event listener for the category form submission
document.querySelector('#addCategoryModal form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect form data
    const formData = new FormData();
    formData.append('CategoryName', document.getElementById('new-category-name').value);
    formData.append('CategoryDescription', document.getElementById('new-category-description').value);
    formData.append('CategoryImage', document.getElementById('new-category-image').files[0]); // Get the file

    try {
        const response = await fetch('http://localhost:5000/api/addCategory', {
            method: 'POST',
            body: formData // Send formData (multipart/form-data)
        });

        if (response.ok) {
            const newCategory = await response.json();
            alert('Category added successfully!');
            document.querySelector('#addCategoryModal form').reset(); // Clear the form after submission
        } else {
            const error = await response.text();
            alert(`Error adding category: ${error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong while adding the category.');
    }
});
    // Event listener for adding existing drug
    document.querySelector('#addExistingDrugModal form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const batch_number = document.getElementById('existing-batch-number').value;

        const response = await fetch('http://localhost:5000/api/addExistingDrug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ batch_number })
        });

        if (response.ok) {
            const existingDrug = await response.json();
            addDrugToTable(existingDrug);  
            // Reset the input field after adding
            document.getElementById('existing-batch-number').value = '';
        } else {
            const error = await response.text(); 
            console.error('Error finding drug:', error); // Log error to console
            alert(`Error finding drug: ${error}`);
        }
    });

    // Load existing orders when the DOM is fully loaded
    loadOrders();
    
    // Event listener for placing an order
    document.querySelector('#placeordermodal form').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const manufacturer_name = document.getElementById('manufacturer-name').value;
        const order_drug_name = document.getElementById('order-drug-name').value;
        const order_category_name = document.getElementById('order-category-name').value;
        const order_drug_quantity = document.getElementById('order-drug-quantity').value;

        const response = await fetch('http://localhost:5000/api/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ manufacturer_name, order_drug_name, order_category_name, order_drug_quantity })
        });

        if (response.ok) {
            const newOrder = await response.json();
            addOrderToTable(newOrder);  // Function to display the new order in the table
            document.querySelector('#placeordermodal form').reset(); // Clear input fields
        } else {
            const error = await response.text();
            alert(`Error placing order: ${error}`);
        }
    });
    loadVerifications();
    loadCustomerOrders();
    // Event listener to populate the dropdown when the modal is shown
const addNewDrugModal = document.getElementById('addNewDrugModal');
addNewDrugModal.addEventListener('show.bs.modal', populateCategoryDropdown);
});

// Function to load existing drugs from the server and display them in the table
async function loadDrugs() {
    const response = await fetch('http://localhost:5000/api/drugs');
    
    if (response.ok) {
        const drugs = await response.json();
        drugs.forEach(drug => {
            addDrugToTable(drug);
        });
    } else {
        console.error('Error loading drugs:', response.statusText);
    }
}

// Function to load existing orders from the server and display them in the table
async function loadOrders() {
    const response = await fetch('http://localhost:5000/api/orders');
    
    if (response.ok) {
        const orders = await response.json();
        orders.forEach(order => {
            addOrderToTable(order);
        });
    } else {
        console.error('Error loading orders:', response.statusText);
    }
}

// Function to add a drug to the table
function addDrugToTable(drug) {
    const tableBody = document.querySelector('#drugTable tbody');
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${drug.item_id}</td>
        <td>${drug.batch_number}</td>
        <td>${drug.item_name}</td>
        <td>${drug.category}</td>
        <td>
            <button type="button" class="btn btn-sm remove-drug-btn" id= "removebtn" data-batch-number="${drug.item_id}">
                <i class="bi bi-trash3-fill"></i> Remove
            </button>
        </td>
    `;
    
    // Attach event listener to remove button
    row.querySelector('.remove-drug-btn').addEventListener('click', async function() {
        const batchNumber = this.getAttribute('data-batch-number');
        const response = await fetch('http://localhost:5000/api/removeDrug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: batchNumber })
        });

        if (response.ok) {
            row.remove();
            alert('Drug removed successfully'); // Optional confirmation message
        } else {
            alert('Error removing drug');
        }
    });

    tableBody.appendChild(row);
}

// Function to add an order to the orders table
function addOrderToTable(order) {
    const tableBody = document.querySelector('#placedOrdersMenu tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${order.order_id}</td>
        <td>${order.manufacturer_name}</td>
        <td>${order.drug_name}</td>
        <td>${order.quantity}</td>
        <td><span class="badge ${order.status === 'Shipped' ? 'bg-success' : 'bg-warning'}">${order.status}</span></td>
        <td>
            <button type="button" class="btn btn-sm btn-danger cancel-order-btn" data-order-id="${order.order_id}" id="cancel">
                Cancel
            </button>
        </td>
    `;

    // Attach event listener to cancel button
    row.querySelector('.cancel-order-btn').addEventListener('click', async function() {
        const orderId = this.getAttribute('data-order-id');
        const response = await fetch('http://localhost:5000/api/cancelOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId })
        });

        if (response.ok) {
            row.remove();
            alert('Order canceled successfully');
        } else {
            alert('Error canceling order');
        }
    });

    tableBody.appendChild(row);
}

async function loadVerifications() {
    const response = await fetch('http://localhost:5000/api/verification');

    if (response.ok) {
        const verifications = await response.json();
        verifications.forEach(verification => {
            addVerificationToTable(verification);
        });
    } else {
        console.error('Error loading verifications:', response.statusText);
    }
}

// Function to add a verification to the table
function addVerificationToTable(verification) {
    const tableBody = document.querySelector('#verificationTableBody'); // Ensure this matches your HTML
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${verification.temp_order_id}</td>
        <td>${verification.user_id}</td>
        <td>
             <a href="#" class="view-prescription" data-verification-id="${verification.temp_order_id}">View Prescription</a>
        </td>
        <td>
            <button type="button" class="btn btn-sm btn-success accept-btn" data-verification-id="${verification.temp_order_id}" id="acceptbtn">Accept</button>
            <button type="button" class="btn btn-sm btn-danger reject-btn" data-verification-id="${verification.temp_order_id}" id="rejectbtn">Reject</button>
        </td>
    `;
    if (verification.status !== "pending") { // Assuming `is_accept` is either `true`, `false`, or `null` for 'N/A'
        disableButtons(row);  // Disable both buttons if there is a decision
    }
    // Attach event listener to view prescription link
row.querySelector('.view-prescription').addEventListener('click', async function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    const verificationId = this.getAttribute('data-verification-id'); // Get verification ID

    try {
        // Fetch the PDF from the server
        const response = await fetch(`http://localhost:5000/api/verification/${verificationId}/pdf`);

        if (response.ok) {
            const pdfBlob = await response.blob(); // Get the PDF as a Blob
            const pdfUrl = URL.createObjectURL(pdfBlob); // Create a URL for the Blob

            // Set the PDF URL to the iframe in the modal
            const modalPDF = document.getElementById('modalPDF');
            modalPDF.src = pdfUrl;

            // Show the modal
            $('#viewPDFModal').modal('show');
        } else {
            alert('Error fetching PDF: ' + response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching PDF');
    }
});


    // Attach event listener to accept button
    row.querySelector('.accept-btn').addEventListener('click', async function() {
        const verificationId = this.getAttribute('data-verification-id');
        
        // Disable both buttons immediately after one is clicked

        // Show the delivery date modal
        $('#deliveryDateModal').modal('show');

        // Handle the form submission
        const deliveryDateForm = document.getElementById('deliveryDateForm');
        deliveryDateForm.onsubmit = async function(event) {
            event.preventDefault(); // Prevent the form from submitting normally
            const deliverDate = document.getElementById('delivery-date').value; // Get the delivery date value

            const response = await fetch('http://localhost:5000/api/verification/accept', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ verification_id: verificationId, deliver_date: deliverDate })
            });

            if (response.ok) {
                alert('Prescription accepted');
                $('#deliveryDateModal').modal('hide'); // Hide the modal after submission
            } else {
                alert('Error accepting prescription');
                enableButtons(row); // Re-enable buttons on error
            }
        };
    });

    // Attach event listener to reject button
    row.querySelector('.reject-btn').addEventListener('click', async function() {
        const verificationId = this.getAttribute('data-verification-id');

        // Disable both buttons immediately after one is clicked

        const response = await fetch('http://localhost:5000/api/verification/reject', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ verification_id: verificationId })
        });

        if (response.ok) {
            alert('Prescription rejected');
        } else {
            alert('Error rejecting prescription');
            enableButtons(row); // Re-enable buttons on error
        }
    });

    tableBody.appendChild(row);
}

// Helper function to disable both buttons in the row
function disableButtons(row) {
    const acceptButton = row.querySelector('.accept-btn');
    const rejectButton = row.querySelector('.reject-btn');
    acceptButton.disabled = true;
    rejectButton.disabled = true;
}

// Helper function to enable both buttons in the row
function enableButtons(row) {
    const acceptButton = row.querySelector('.accept-btn');
    const rejectButton = row.querySelector('.reject-btn');
    acceptButton.disabled = false;
    rejectButton.disabled = false;
}
// Function to load customer orders where is_payment is TRUE
async function loadCustomerOrders() {
    const response = await fetch('http://localhost:5000/api/customerOrders');

    if (response.ok) {
        const orders = await response.json();
        const tableBody = document.querySelector('#ordersMenu tbody');
        tableBody.innerHTML = ''; // Clear the table

        orders.forEach(order => {
            addOrderToCustomerTable(order);
        });
    } else {
        console.error('Error loading customer orders:', response.statusText);
    }
}

// Function to add an order to the customer orders table
function addOrderToCustomerTable(order) {
    const tableBody = document.querySelector('#ordersMenu tbody');
    const row = document.createElement('tr');

    const shipStatusBadge = order.ship_status === 'Shipped' ?
        '<span class="badge bg-success">Shipped</span>' :
        '<span class="badge bg-warning">Processing</span>';

    const disabledButton = order.ship_status === 'Shipped' ? 'disabled' : '';

    row.innerHTML = `
        <td>${order.order_id}</td>
        <td>${order.user_id}</td>
        <td>${order.total_amount}</td>
        <td>${new Date(order.order_date).toLocaleDateString()}</td>
        <td>${new Date(order.delivery_date).toLocaleDateString()}</td>
        <td>${shipStatusBadge}</td>
        <td>
            <button type="button" class="btn btn-sm btn-success mark-shipped-btn" data-order-id="${order.order_id}" ${disabledButton}>
                Mark as Shipped
            </button>
        </td>
    `;

    // Attach event listener to "Mark as Shipped" button
    row.querySelector('.mark-shipped-btn').addEventListener('click', async function () {
        const orderId = this.getAttribute('data-order-id');
        const response = await fetch('http://localhost:5000/api/markAsShipped', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ order_id: orderId })
        });

        if (response.ok) {
            const updatedOrder = await response.json();
            this.setAttribute('disabled', 'true');  // Disable the button
            this.closest('tr').querySelector('td:nth-child(6)').innerHTML = '<span class="badge bg-success">Shipped</span>';  // Update status
            alert('Order marked as shipped');
        } else {
            alert('Error marking order as shipped');
        }
    });

    tableBody.appendChild(row);
}
// Function to fetch and populate categories in the dropdown
async function populateCategoryDropdown() {
    const dropdown = document.getElementById('new-drug-category');

    try {
        const response = await fetch('http://localhost:5000/api/categories');
        const categories = await response.json();

        // Clear existing options
        dropdown.innerHTML = '<option value="" disabled selected>Select drug category...</option>'; // Reset options

        // Add categories to the dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_name; // Use the appropriate field from your category table
            option.textContent = category.category_name; // Display category name
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}
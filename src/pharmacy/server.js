const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const multer = require('multer');
const opn = require('opn');
const bcrypt= require('bcrypt');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'shopper_db',
    password: 'Dhanya@2004',
    port: 5432,
});


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Home route
app.get('/', async (req, res) => {
    const isLoggedIn = req.session.pharmacyId ? true : false;
    res.render('pharmacy', { isLoggedIn });
});

// Registration
app.get('/register', (req, res) => {
    res.render('register');
});

// Insert into users while registration
app.post('/register', async (req, res) => {
    const { pharmacy_name,phone, email,city,address,pincode, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO pharmacy (pharmacy_name,phone, email,city,address,pincode, password) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING pharmacy_id', [pharmacy_name,phone, email,city,address,pincode, hashedPassword]);
    req.session.pharmacyId = result.rows[0].pharmacy_id;
    res.redirect('/');
});

// Login
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle validation of login credentials
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const pharmacy = await pool.query('SELECT * FROM pharmacy WHERE email = $1', [email]);
    if (pharmacy.rows.length > 0 && await bcrypt.compare(password, pharmacy.rows[0].password)) {
        req.session.pharmacyId = pharmacy.rows[0].pharmacy_id;
        return res.redirect('/');
    }
    res.send('Invalid credentials');
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Route to place an order (PLaced orders)
app.post('/api/placeOrder', async (req, res) => {
    const { manufacturer_name, order_drug_name, order_category_name, order_drug_quantity } = req.body;

    try {
        const newOrder = await pool.query(
            `INSERT INTO pharmacy_orders (manufacturer_name, drug_name, category_name, quantity, status) 
             VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
            [manufacturer_name, order_drug_name, order_category_name, order_drug_quantity]
        );

        res.json(newOrder.rows[0]);
    } catch (err) {
        console.error('Error placing order:', err.message);
        res.status(500).send('Server error');
    }
});

// Route to get all orders (Placed orders)
app.get('/api/orders', async (req, res) => {
    try {
        const allOrders = await pool.query('SELECT * FROM pharmacy_orders');
        res.json(allOrders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to cancel an order (Placed orders)
app.post('/api/cancelOrder', async (req, res) => {
    const { order_id } = req.body;
    try {
        const result = await pool.query(
            `DELETE FROM pharmacy_orders WHERE order_id = $1 RETURNING *`,
            [order_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to update order status to "Shipped" (Placed orders)
app.put('/api/shipped', async (req, res) => { 
    const { order_id } = req.body;  // Ensure order_id comes from req.body
    try {
        // Update the order's status to 'Shipped'
        const updateOrder = await pool.query(
            'UPDATE pharmacy_orders SET status = $1 WHERE order_id = $2',
            ['Shipped', order_id]
        );

        if (updateOrder.rowCount === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order marked as shipped' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to add new category (Add details)
const storage2 = multer.memoryStorage();
const upload2 = multer({ storage: storage2 });

app.post('/api/addCategory', upload2.single('CategoryImage'), async (req, res) => {
    const { CategoryName, CategoryDescription } = req.body;
    const categoryImage = req.file ? req.file.buffer : null; // Get the binary data of the uploaded category image

    // Log incoming data for debugging
    console.log('Received data:', {
        CategoryName,
        CategoryDescription,
        hasImage: !!categoryImage, // Check if there's an image
        imageSize: categoryImage ? categoryImage.length : 0 // Log image size
    });

    try {
        // Insert the category data into the database
        const newCategory = await pool.query(
            `INSERT INTO category (category_name, description, category_image) 
            VALUES ($1, $2, $3) RETURNING *`,
            [CategoryName, CategoryDescription, categoryImage]
        );

        console.log('New category added:', newCategory.rows[0]); // Log the newly created category
        res.json(newCategory.rows[0]); // Send the newly created category as response
    } catch (err) {
        console.error('Error adding category:', err.message);
        res.status(500).send('Server error');
    }
});

// Route to get all categories (Add details)
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM category'); // Fetch all categories
        res.json(result.rows); // Send the categories as response
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Server error');
    }
});

// Route to add a new drug (with image upload) (Add details)
const storage1 = multer.memoryStorage();
const upload1 = multer({ storage: storage1 });

app.post('/api/addNewDrug', upload1.single('drug_image'), async (req, res) => {
    const { item_name, batch_number, price, category, manufacturing_date, expiry_date, description } = req.body;
    const drug_image = req.file ? req.file.buffer : null; // Get the filename of the uploaded image

    try {
        // Fetch category_id for the provided category name
        const categoryResult = await pool.query(`SELECT category_id FROM category WHERE category_name = $1`, [category]);

        // Check if the category exists
        if (categoryResult.rows.length === 0) {
            return res.status(400).send('Category not found');
        }

        const category_id = categoryResult.rows[0].category_id; // Extract the category_id

        // Insert the new drug with the fetched category_id
        const newDrug = await pool.query(
            `INSERT INTO items (item_name, batch_number, price, category, manufacturing_date, expiry_date, drug_image, description, is_removed, category_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, $9) RETURNING *`,
            [item_name, batch_number, price, category, manufacturing_date, expiry_date, drug_image, description, category_id]
        );
        
        res.json(newDrug.rows[0]);
    } catch (err) {
        console.error('Error adding new drug:', err.message);
        res.status(500).send('Server error');
    }
});

// Route to add an existing drug (Add details)
app.post('/api/addExistingDrug', async (req, res) => {
    const { batch_number } = req.body;
    try {
        const existingDrug = await pool.query(
            `SELECT * FROM items WHERE batch_number = $1`,
            [batch_number]
        );
        if (existingDrug.rows.length > 0) {
            // Set is_removed to false
            await pool.query(
                `UPDATE items SET is_removed = FALSE WHERE batch_number = $1`,
                [batch_number]
            );
            res.json(existingDrug.rows[0]);
        } else {
            res.status(404).send('Drug not found');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get all drugs (Add details)
app.get('/api/drugs', async (req, res) => {
    try {
        const allDrugs = await pool.query('SELECT * FROM items WHERE is_removed = FALSE');
        res.json(allDrugs.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to remove a drug (set is_removed to true) (Add details)
app.post('/api/removeDrug', async (req, res) => {
    const { id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE items SET is_removed = TRUE WHERE item_id = $1 RETURNING *`,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Drug not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to get customer orders with payment confirmed (is_payment = TRUE) (Orders)
app.get('/api/customerOrders', async (req, res) => {
    try {
        const customerOrders = await pool.query(`
            SELECT * FROM orders WHERE is_payment = TRUE
        `);
        res.json(customerOrders.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to mark order as shipped (Orders)
app.post('/api/markAsShipped', async (req, res) => {
    const { order_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE orders SET ship_status = 'Shipped' WHERE order_id = $1 RETURNING *`,
            [order_id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).send('Order not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to fetch all verifications for admin (Verify)
app.get('/api/verification', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM temp_orders');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching verifications:', error);
        res.status(500).send('Error fetching verifications');
    }
});

// Route to accept a verification (Verify)
app.put('/api/verification/accept', async (req, res) => {
    const { verification_id, deliver_date } = req.body;

    try {
        // Step 1: Retrieve the temp order details
        const tempOrderResult = await pool.query(
            'SELECT * FROM temp_orders WHERE temp_order_id = $1',
            [verification_id]
        );

        if (tempOrderResult.rows.length === 0) {
            return res.status(404).send('Temp order not found');
        }

        const tempOrder = tempOrderResult.rows[0];
        if (!tempOrder.address) {
            console.error('Address is undefined or null');
        }else{
            console.log(tempOrder.address);
        }

        // Step 2: Insert into the orders table
        const orderResult = await pool.query(
            'INSERT INTO orders (user_id, delivery_date, total_amount,temp_order_id,address) VALUES ($1, $2, $3,$4,$5) RETURNING order_id',
            [tempOrder.user_id, deliver_date, tempOrder.total_amount,verification_id,tempOrder.address]
        );

        const orderId = orderResult.rows[0].order_id;

        // Step 3: Insert into the order_item table for each item in temp_order_items
        const tempOrderItemsResult = await pool.query(
            'SELECT * FROM temp_order_item WHERE temp_order_id = $1',
            [verification_id]
        );

        const insertOrderItemsPromises = tempOrderItemsResult.rows.map(item => {
            return pool.query(
                'INSERT INTO order_item (order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.item_id, item.quantity, item.price]
            );
        });

        await Promise.all(insertOrderItemsPromises);

        // Step 4: Update the temp_orders status
        await pool.query(
            'UPDATE temp_orders SET status = $1 WHERE temp_order_id = $2',
            [true, verification_id]
        );

        res.send('Verification accepted and order created');
    } catch (error) {
        console.error('Error accepting verification:', error);
        res.status(500).send('Error accepting verification');
    }
});

// Route to reject a verification (Verify)
app.put('/api/verification/reject', async (req, res) => {
    const { verification_id } = req.body;

    try {
        await pool.query(
            'UPDATE temp_orders SET status = $1 WHERE temp_order_id = $2',
            [false, verification_id]
        );
        res.send('Verification rejected');
    } catch (error) {
        console.error('Error rejecting verification:', error);
        res.status(500).send('Error rejecting verification');
    }
});

// Route to fetch a specific PDF by verification ID (Verify details)
app.get('/api/verification/:id/pdf', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT prescription_file FROM temp_orders WHERE temp_order_id = $1', [id]);
        
        if (result.rows.length > 0) {
            const pdfData = result.rows[0].prescription_file;
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData); // Send the binary data as a response
        } else {
            res.status(404).send('PDF not found');
        }
    } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Error fetching PDF');
    }
});

// Start server on port 5000
app.listen(5000, () => {
    console.log('Server is running on port 5000');
    opn(`http://localhost:${5000}`);
});
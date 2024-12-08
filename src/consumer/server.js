// server.js for consumers

//All the packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
const opn = require('opn');
const multer = require('multer');
const nodemailer = require('nodemailer');
const cors = require('cors'); 

//define express and port
const app = express();
const port = process.env.PORT || 4000;

// PostgreSQL pool setup
const pool = new Pool({
    user: 'postgres',   
    host: 'localhost',
    database: 'shopper_db',
    password: 'Dhanya@2004',
    port: 5432,
});

// Middleware
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret_key', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
}));

// Home route
app.get('/', async (req, res) => {
    const isLoggedIn = req.session.userId ? true : false;
    try {
        // Fetch reviews
        const reviewsResult = await pool.query(`
            SELECT r.*, u.user_name 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            ORDER BY r.created_at DESC
        `);
        const reviews = reviewsResult.rows; // Fetch reviews from the database
        
        // Fetch top ordered items
        const topItemsResult = await pool.query(`
            SELECT 
                i.item_id,
                i.item_name,
                i.drug_image,
                SUM(oi.quantity) AS total_ordered
            FROM 
                items i
            JOIN 
                order_item oi ON i.item_id = oi.item_id
            JOIN 
                orders o ON oi.order_id = o.order_id
            WHERE 
                o.is_payment = true
            GROUP BY 
                i.item_id, i.item_name, i.drug_image
            ORDER BY 
                total_ordered DESC
            LIMIT 8
        `);
        const topItems = topItemsResult.rows; // Fetch top items from the database
        
        // Render the home page with reviews and top items
        res.render('home', { isLoggedIn, reviews, topItems });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching data');
    }
});



// Registration
app.get('/register', (req, res) => {
    res.render('register');
});

// Insert into users while registration
app.post('/register', async (req, res) => {
    const { user_name,phone, email,city,address,pincode, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query('INSERT INTO users (user_name,phone, email,city,address,pincode, password) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING user_id', [user_name,phone, email,city,address,pincode, hashedPassword]);
    req.session.userId = result.rows[0].user_id;
    res.redirect('/');
});

// Login
app.get('/login', (req, res) => {
    res.render('login');
});

// Handle validation of login credentials
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length > 0 && await bcrypt.compare(password, user.rows[0].password)) {
        req.session.userId = user.rows[0].user_id;
        return res.redirect('/');
    }
    res.send('Invalid credentials');
});

// Logout
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Search results route
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const isLoggedIn = req.session.userId ? true : false;
    try {
        const query = `
            SELECT * FROM items
            WHERE item_name ILIKE $1 OR description ILIKE $1
        `;
        const values = [`%${searchTerm}%`];
        const result = await pool.query(query, values);
        const items = result.rows;
        res.render('search-results', { items, isLoggedIn });
    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).send('Error fetching search results.');
    }
});

// Categories route
app.get('/categories', async (req, res) => {
    try {
        const query = 'SELECT * FROM category';
        const categories = await pool.query(query);
        res.render('categories', { categories: categories.rows });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Error fetching categories.');
    }
});

// Items route for each category
app.get('/categories/:id', async (req, res) => {
    const categoryId = req.params.id;
    const isLoggedIn = req.session.userId ? true : false;

    try {
        const query = 'SELECT * FROM items WHERE category_id = $1';
        const values = [categoryId];
        const result = await pool.query(query, values);
        const items = result.rows;
        res.render('category-list', { items: items, categoryId, isLoggedIn });
    } catch (error) {
        console.error('Error fetching category items:', error);
        res.status(500).send('Error fetching category items.');
    }
});

// Function to get cart items
async function getCartItems(userId) {
    const result = await pool.query(
        'SELECT items.item_id, items.item_name, items.description, items.price, cart.quantity FROM cart JOIN items ON cart.item_id = items.item_id WHERE cart.user_id = $1',
        [userId]
    );
    return result.rows;
}

// Function to clear the cart
async function clearCart(userId) {
    await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
}

// Route to add items to cart
app.post('/add-to-cart', async (req, res) => {
    const userId = req.session.userId;
    req.session.userId=userId;
    const { itemId, quantity } = req.body;
    if (!userId) {
        return res.status(401).send('You need to be logged in to add items to your cart.');
    }
    try {
        const parsedItemId = parseInt(itemId, 10);
        const parsedQuantity = parseInt(quantity, 10);
        if (isNaN(parsedItemId) || isNaN(parsedQuantity) || parsedQuantity < 1) {
            return res.status(400).send('Invalid item ID or quantity');
        }
        await pool.query(
            'INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3)',
            [userId, parsedItemId, parsedQuantity]
        );
        res.redirect('/cart');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding item to cart.');
    }
});

// Route to view cart items
app.get('/cart', async (req, res) => {
    const userId = req.session.userId;
    req.session.userId=userId;
    if (!userId) {
        return res.redirect('/login');
    }
    const cartItemsResult = await pool.query(
        'SELECT items.item_name, items.description, CAST(items.price AS DECIMAL(10, 2)) AS price, cart.quantity ' +
        'FROM cart ' +
        'JOIN items ON cart.item_id = items.item_id ' +
        'WHERE cart.user_id = $1',
        [userId]
    );
    const cartItems = cartItemsResult.rows;
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
    res.render('cart', { cartItems, totalAmount });
});

// Route to clear the cart
app.post('/clear-cart', async (req, res) => {
    const userId = req.session.userId;
    req.session.userId=userId;
    if (!userId) {
        return res.redirect('/login');
    }
    try {
        await clearCart(userId); 
        res.redirect('/cart');
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).send('Error clearing cart.');
    }
});

// Function to get saved address from the database
async function getUserSavedAddress(userId) {
    try {
        const query = "SELECT address, city, pincode FROM users WHERE user_id = $1";
        const values = [userId];
        const result = await pool.query(query, values);
        if (result.rows.length > 0) {
            const { address, city, pincode } = result.rows[0];
            return `${address}, ${city}, ${pincode}`;
        } else {
            throw new Error('No saved address found for this user.');
        }
    } catch (error) {
        console.error('Error retrieving saved address:', error);
        throw error;
    }
}

// Route to place order
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/place-order", upload.single("prescriptionUpload"), async (req, res) => {
    const userId = req.session.userId;
    req.session.userId=userId;
    if (!userId) {
        return res.status(401).send('You need to be logged in to upload a prescription.');
    }
    const file = req.file;
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }
    const { addressOption, address, city, pincode } = req.body;
    let finalAddress;
    if (addressOption === 'new') {
        finalAddress = `${address}, ${city}, ${pincode}`;
    } else {
        const savedAddress = await getUserSavedAddress(userId);
        finalAddress = savedAddress;
    }
    try {
        const cartItems = await getCartItems(userId);
        const totalAmount = cartItems.reduce((total, item) => {
            return total + (parseFloat(item.price) * item.quantity);
        }, 0);
        const query = "INSERT INTO temp_orders (user_id, total_amount, prescription_file, address) VALUES ($1, $2, $3, $4) RETURNING temp_order_id";
        const values = [userId, totalAmount, file.buffer, finalAddress];
        const result = await pool.query(query, values);
        const tempOrderId = result.rows[0].temp_order_id;
        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO temp_order_item (temp_order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [tempOrderId, item.item_id, item.quantity, item.price]
            );
        }
        await clearCart(userId);
        res.redirect('/orders');
    } catch (error) {
        console.error('Error uploading the prescription and placing the order:', error);
        res.status(500).send("Error processing your order.");
    }
});

// Show Orders
app.get('/orders', async (req, res) => {
    try {
        const userId = req.session.userId;
        req.session.userId=userId;
        if (!userId) {
            return res.status(401).send('Unauthorized: No user ID found');
        }
        const query = 'SELECT * FROM temp_orders WHERE user_id = $1 and is_removed=$2';
        const values = [userId,false];
        const orders = await pool.query(query, values);
        res.render('orders', { orders: orders.rows });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders.');
    }
});

// Route to get order items and address of each order
app.get('/order-details/:temp_order_id', async (req, res) => {
    const tempOrderId = req.params.temp_order_id;
    try {
        const query = `
            SELECT temp_order_item.quantity, items.item_name, temp_order_item.price, temp_orders.address
            FROM temp_order_item
            JOIN items ON temp_order_item.item_id = items.item_id
            JOIN temp_orders ON temp_order_item.temp_order_id = temp_orders.temp_order_id
            WHERE temp_order_item.temp_order_id = $1
        `;
        const orderDetails = await pool.query(query, [tempOrderId]);
        if (orderDetails.rows.length === 0) {
            return res.status(404).send('No items found for this order.');
        }
        const items = orderDetails.rows.map(row => ({
            quantity: row.quantity,
            item_name: row.item_name,
            price: row.price
        }));
        const address = orderDetails.rows[0].address;
        res.json({ items, address });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to remove orders from orders page
app.post('/api/remove-order', async (req, res) => {
    const { order_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE temp_orders SET is_removed = $1 WHERE temp_order_id = $2',
            [true, order_id]
        );
        if (result.rowCount > 0) {
            res.redirect('/orders');
        } else {
            res.status(404).send('Order not found');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error marking order as removed');
    }
});

// Proceed to pay route
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: 'your_key_id',
    key_secret: 'your_key_secret',
});

app.get('/proceed-to-pay/:temp_order_id', async (req, res) => {
    const { temp_order_id } = req.params;
    try {
        const orderQuery = 'SELECT * FROM orders WHERE temp_order_id = $1';
        const result = await pool.query(orderQuery, [temp_order_id]);
        if (result.rows.length === 0) {
            return res.status(404).render('404', { message: 'Order not found' });
        }
        const orderDetails = result.rows[0];
        const userId=orderDetails.user_id;
        const totalAmount = Number(orderDetails.total_amount);
        const options = {
            amount: Math.floor(totalAmount * 100),
            currency: 'INR',
            receipt: `receipt_order_${orderDetails.user_id}_${Date.now()}`,
        };
        const razorpayOrder = await razorpay.orders.create(options);
        res.render('payment', {
            userId:userId,
            new_var:orderDetails.order_id,
            orderId: razorpayOrder.id,
            totalAmount: totalAmount.toFixed(2),
            key: razorpay.key_id,
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).render('error', { message: 'An error occurred while processing the payment' });
    }
});

// After payment is confirmed
app.get('/confirm-payment', async (req, res) => {
    const paymentId = req.query.paymentId;
    const orderId = req.query.orderId;
    const userId = req.query.userId;
    req.session.userId=userId;
    const paymentDetails = await razorpay.payments.fetch(paymentId);
    const totalAmount = paymentDetails.amount / 100;
    if (!paymentId) {
        return res.status(400).send('Payment failed');
    }
    if (!orderId || !userId || !totalAmount) {
        return res.status(400).send('Invalid session data');
    }
    try {
        await pool.query(
            'INSERT INTO payments (payment_id, user_id, order_id, amount, currency, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [paymentId, userId, orderId, totalAmount, 'INR', 'success']
        );
        res.redirect(`/order-confirmation?paymentId=${paymentId}`);
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).send('Error confirming payment.');
    }
});

// Route to show the order confirmation page
app.get('/order-confirmation', async (req, res) => {
    const paymentId = req.query.paymentId;
    if (!paymentId) {
        return res.status(400).send('Invalid payment ID');
    }
    try {
        const paymentResult = await pool.query(
            'SELECT order_id FROM payments WHERE payment_id = $1',
            [paymentId]
        );
        if (paymentResult.rows.length === 0) {
            return res.status(404).send('Payment not found.');
        }
        const orderId = paymentResult.rows[0].order_id;
        const orderResult = await pool.query(
            'SELECT temp_order_id FROM orders WHERE order_id = $1',
            [orderId]
        );
        if (orderResult.rows.length === 0) {
            return res.status(404).send('Order not found.');
        }
        const tempOrderId = orderResult.rows[0].temp_order_id;
        await pool.query(
            'UPDATE temp_orders SET is_payment = TRUE WHERE temp_order_id = $1',
            [tempOrderId]
        );
        await pool.query(
            'UPDATE orders SET is_payment = TRUE WHERE order_id = $1',
            [orderId]
        );
        await sendOrderConfirmation(orderId);
        res.render('order-confirmation');
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).send('Error updating payment status.');
    }
});

// Reviews page (fetch reviews, including user info)
app.get('/reviews', async (req, res) => {
    const userId = req.session.userId; 
    req.session.userId=userId;
    try {
        const result = await pool.query(`
            SELECT r.*, u.user_name, u.email 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            ORDER BY r.created_at DESC
        `);
        res.render('reviews', { reviews: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching reviews');
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT r.reviews_id, r.comment, r.rating, u.user_name, u.email 
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching reviews');
    }
});

// POST route to handle review submission
app.post('/reviews', async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.session.userId;
    req.session.userId=userId;
    const sql = 'INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3)';
    try {
        await pool.query(sql, [userId, rating, comment]);
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error posting review');
    }
});

// About us page
app.get('/aboutus', (req, res) => {
    res.render('aboutus');
});

// Contact us page
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Help page
app.get('/help', (req, res) => {
    res.render('help');
});

// Profile page
app.get('/profile', async (req, res) => {
    const userId = req.session.userId;
    try {
        const userQuery = 'SELECT * FROM users WHERE user_id = $1';
        const userResult = await pool.query(userQuery, [userId]);
        const user = userResult.rows[0];
        const ordersQuery = `
            SELECT order_id, order_date, total_amount, delivery_date, is_payment, ship_status
            FROM orders
            WHERE user_id = $1
        `;
        const ordersResult = await pool.query(ordersQuery, [userId]);
        const orders = ordersResult.rows;
        res.render('profile', { user, orders });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to update username
app.post('/update-username', async (req, res) => {
    const userId = req.session.userId;
    const { username } = req.body;
    if (!userId) {
        return res.status(401).send('Unauthorized: No user ID found');
    }
    try {
        await pool.query('UPDATE users SET user_name = $1 WHERE user_id = $2', [username, userId]);
        res.redirect('/profile');
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).send('Error updating username.');
    }
});

// Route to change password
app.post('/change-password', async (req, res) => {
    const userId = req.session.userId;
    const { oldPassword, newPassword } = req.body;
    if (!userId) {
        return res.status(401).send('Unauthorized: No user ID found');
    }
    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordStrengthRegex.test(newPassword)) {
        return res.status(400).send('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    try {
        const result = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
            return res.status(400).send('Old password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [hashedPassword, userId]);
        res.send('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Error changing password');
    }
});

// Route to delete user account
app.delete('/delete-account', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send('Unauthorized: No user ID found');
    }
    try {
        await pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
        req.session.destroy();
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).send('Error deleting account.');
    }
});

// Route to upload profile image
const storage1 = multer.memoryStorage();
const upload1 = multer({ storage: storage1 });

app.post('/upload-image', upload1.single('profile-image'), async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).send('Unauthorized: No user ID found');
    }
    try {
        const imageBuffer = req.file.buffer;
        await pool.query('UPDATE users SET user_image = $1 WHERE user_id = $2', [imageBuffer, userId]);
        res.send('Image uploaded successfully');
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Error uploading image');
    }
});

async function sendOrderConfirmation(orderId) {
    // Query to get the pharmacy's email and password
    const pharmacyResult = await pool.query(`
        SELECT email AS pharmacy_email, app_password1 AS pharmacy_password
        FROM pharmacy
        WHERE pharmacy_id = 3`); // Assuming pharmacy_id = 3 is fixed

    // Check if pharmacy email is found
    if (pharmacyResult.rows.length === 0) {
        throw new Error('No pharmacy found for pharmacy_id = 3.');
    }

    const pharmacyEmail = pharmacyResult.rows[0].pharmacy_email;
    const pharmacyPassword = pharmacyResult.rows[0].pharmacy_password;

    // Create a transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or any other email service
        auth: {
            user: pharmacyEmail, // sender's email from the pharmacy table
            pass: pharmacyPassword // sender's email password from the pharmacy table
        }
    });

    try {
        // Query to get the user's email from the orders table
        const userResult = await pool.query(`
            SELECT u.email AS user_email 
            FROM users u
            JOIN orders o ON u.user_id = o.user_id
            WHERE o.order_id = $1`, [orderId]);

        // Check if user email is found
        if (userResult.rows.length === 0) {
            throw new Error('No user email found for the specified order ID.');
        }
        
        const userEmail = userResult.rows[0].user_email;

        // Email options
        const mailOptions = {
            from: pharmacyEmail, // sender address (pharmacy's email)
            to: userEmail, // receiver (user's email)
            subject: 'Order Confirmation', // Subject line
            text: `Your order with ID ${orderId} has been successfully placed. Thank you for choosing us!`, // plain text body
        };

        // Send mail
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending email:', error);
            }
            console.log('Email sent: ' + info.response);
        });
    } catch (error) {
        console.error('Error in sendOrderConfirmation:', error);
    }
}

// app.post('/hash-password/:pharmacyId/:plainPassword', async (req, res) => {
//     const pharmacyId = req.params.pharmacyId;
//     const plainPassword = req.params.plainPassword;

//     if (!pharmacyId || !plainPassword) {
//         return res.status(400).json({ error: 'pharmacyId and plainPassword are required.' });
//     }

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(plainPassword, 10);

//         // Store the hashed password in the database
//         await pool.query(
//             'UPDATE pharmacy SET app_password = $1 WHERE pharmacy_id = $2',
//             [hashedPassword, pharmacyId]
//         );

//         res.status(200).json({ message: 'Password hashed and stored successfully!' });
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });
// Start the server and open the home page
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    opn(`http://localhost:${port}`); // Open the home page in the default browser
});
const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* GET ALL ORDERS */
    router.get("/get-orders", (request, response) => {
        const query = 'SELECT o.id as id, u.first_name, u.last_name, u.email, o.date, o.payment_status FROM orders o LEFT OUTER JOIN users u ON o.user = u.id';
        con.query(query, (err, res) => {
            if (res) {
                response.send({
                    result: res
                });
            } else {
                response.send({
                    result: []
                });
            }
        });
    });

    /* TODO - change logic */
    const decrementStock = (productId, size, quantity) => {
        const values = [quantity, productId, size];
        const query1 = 'UPDATE products_stock SET size_1_stock = size_1_stock - ? WHERE product_id = ? AND size_1_name = ?';
        const query2 = 'UPDATE products_stock SET size_2_stock = size_2_stock - ? WHERE product_id = ? AND size_2_name = ?';
        const query3 = 'UPDATE products_stock SET size_3_stock = size_3_stock - ? WHERE product_id = ? AND size_3_name = ?';
        const query4 = 'UPDATE products_stock SET size_4_stock = size_4_stock - ? WHERE product_id = ? AND size_4_name = ?';
        const query5 = 'UPDATE products_stock SET size_5_stock = size_5_stock - ? WHERE product_id = ? AND size_5_name = ?';

        con.query(query1, values);
        con.query(query2, values);
        con.query(query3, values);
        con.query(query4, values);
        con.query(query5, values);
    }

        /* ADD SELL */
        router.post("/add-sell", (request, response) => {
            let {productId, orderId, quantity, size, paymentMethod} = request.body;

            const values = [orderId, productId, quantity, size];
            const query = 'INSERT INTO sells VALUES (NULL, ?, ?, ?, ?)';

            decrementStock(productId, size, quantity);

            if(paymentMethod === 1) {
                /* Jesli za pobraniem - dekrementuj stan magazynowy */
            }

            con.query(query, values, (err, res) => {
                if (res) {
                    response.send({
                        result: res.insertId
                    });
                } else {
                    console.log(err);
                    response.send({
                        result: null
                    });
                }
            });
        });

        /* ADD ORDER */
        router.post("/add", (request, response) => {
            let {paymentMethod, shippingMethod, city, street, building, flat, postalCode, sessionId, user, comment, companyName, nip, amount, inPostAddress, inPostCode, inPostCity} = request.body;
            if (flat === "") flat = null;

            let paymentStatus = "nieopłacone";
            console.log(paymentMethod);
            if(paymentMethod === 1) {
                /* Payment method - za pobraniem */
                paymentStatus = "za pobraniem";
            }

            building = parseInt(building) || 0;
            let values = [paymentMethod, shippingMethod, city, street, building, flat, postalCode, user, paymentStatus, comment, sessionId, companyName, nip, amount, inPostAddress, inPostCode, inPostCity];
            const query = 'INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, "przyjęte do realizacji", CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?)';

            values = values.map((item) => {
                if (item === "") return null;
                else return item;
            });

            con.query(query, values, (err, res) => {
                let result = 0;
                console.log(err);
                if (res) {
                    if (res.insertId) result = res.insertId;
                }
                response.send({
                    result
                });
            });
        });

        /* CHANGE PAYMENT STATUS */
        router.post("/change-payment-status", (request, response) => {
            const {id, status} = request.body;
            const values = [status, id];
            const query = 'UPDATE orders SET payment_status = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
                let result = 0;
                if (res) result = 1;
                response.send({
                    result
                });
            });
        });

        /* CHANGE ORDER STATUS */
        router.post("/change-order-status", (request, response) => {
            const {id, status} = request.body;
            const values = [status, id];
            const query = 'UPDATE orders SET order_status = ? WHERE id = ?';
            con.query(query, values, (err, res) => {
                let result = 0;
                if (res) result = 1;
                response.send({
                    result
                });
            });
        });

        /* REMOVE ORDER */
        router.post("/delete", (request, response) => {
            const {id} = request.body;
            const values = [id];
            const query = 'DELETE FROM orders WHERE id = ?';
            con.query(query, values, (err, res) => {
                let result = 0;
                if (res) result = 1;
                response.send({
                    result
                });
            });
        });

        /* GET ORDER DETAILS */
        router.post("/get-order", (request, response) => {
            const {id} = request.body;
            const values = [id];
            const query = 'SELECT o.id, o.payment_status, u.first_name, u.last_name, u.email, u.phone_number, o.date, o.order_status, pm.name as payment, sm.name as shipping, o.order_comment, o.company_name, o.nip, s.size, s.quantity, p.price, p.name, o.inpost_address, o.inpost_postal_code, inpost_city FROM orders o ' +
                'JOIN sells s ON o.id = s.order_id ' +
                'LEFT OUTER JOIN products p ON p.id = s.product_id ' +
                'JOIN shipping_methods sm ON o.shipping_method = sm.id ' +
                'JOIN payment_methods pm ON o.payment_method = pm.id ' +
                'JOIN users u ON u.id = o.user ' +
                'WHERE o.id = ?;';
            con.query(query, values, (err, res) => {
                if(res) {
                    response.send({
                        result: res
                    });
                } else {
                    response.send({
                        result: null
                    });
                }
            });
        });

        /* GET ORDER RIBBONS */
        router.post("/get-ribbons", (request, response) => {
            const {id} = request.body;
            const values = [id];
            const query = 'SELECT r.caption FROM ribbons r JOIN orders o ON r.order_id = o.id WHERE o.id = ?';
            con.query(query, values, (err, res) => {
                console.log(err);
                if (res) {
                    response.send({
                        result: res
                    });
                } else {
                    response.send({
                        result: 0
                    });
                }
            });
        });
});

module.exports = router;

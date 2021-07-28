const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* GET ALL ORDERS */
    router.get("/get-orders", (request, response) => {
        const query = 'SELECT o1.id as id, u.first_name, u.last_name, u.email, pm.name, o2.payment_status, o2.order_status, o2.date ' +
            'FROM (SELECT o.id, price FROM orders o ' +
            'JOIN sells s ON o.id = s.order_id ' +
            'JOIN products p ON p.id = s.product_id GROUP BY o.id) o1 ' +
            'JOIN orders o2 USING(id) JOIN users u ON u.id = o2.user ' +
            'LEFT OUTER JOIN payment_methods pm ON o2.payment_method = pm.id';
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

        /* ADD SELL */
        router.post("/add-sell", (request, response) => {
            console.log("/add-sell");
            let {productId, orderId, quantity, size} = request.body;
            const values = [orderId, productId, quantity, size];
            const query = 'INSERT INTO sells VALUES (NULL, ?, ?, ?, ?)';
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

        /* ADD RIBBON */
        router.post("/add-ribbon", (request, response) => {
            let {orderId, caption} = request.body;
            const values = [orderId, caption];
            const query = 'INSERT INTO ribbons VALUES (NULL, ?, ?)';
            con.query(query, values, (err, res) => {
                console.log(err);
                if (res) {
                    response.send({
                        result: 1
                    });
                } else {
                    response.send({
                        result: 0
                    });
                }
            });
        });

        /* ADD ORDER */
        router.post("/add", (request, response) => {
            let {paymentMethod, shippingMethod, city, street, building, flat, postalCode, sessionId, user, comment, companyName, nip, amount, inPostAddress, inPostCode, inPostCity} = request.body;
            if (flat === "") flat = null;
            console.log("/add-order");
            building = parseInt(building) || 0;
            let values = [paymentMethod, shippingMethod, city, street, building, flat, postalCode, user, comment, sessionId, companyName, nip, amount, inPostAddress, inPostCode, inPostCity];
            const query = 'INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, "nieopłacone", "przyjęte do realizacji", CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?)';

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
            const query = 'SELECT o.id, u.first_name, u.last_name, u.email, u.phone_number, o.date, o.order_status, pm.name as payment, sm.name as shipping, o.company_name, o.nip, s.size, s.quantity, p.price, p.name, o.inpost_address, o.inpost_postal_code, inpost_city FROM orders o ' +
                'JOIN sells s ON o.id = s.order_id ' +
                'JOIN products p ON p.id = s.product_id ' +
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

const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const got = require("got");
const cors = require("cors");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');

con.connect(err => {
    /* Set Przelewy24 credentials */
    router.post("/change-data", (request, response) => {
        const { marchantId, crc, apiKey } = request.body;

        const values = [marchantId, crc, apiKey];
        const query = 'UPDATE przelewy24 SET marchant_id = ?, crc = ?, api_key = ? WHERE id = 1';
        con.query(query, values, (err, res) => {
            let result = 0;
            if(res) result = 1;
            response.send({
                result
            });
        });
    });

    /* Get Przelewy24 credentials */
    router.get("/get-data", (request, response) => {
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
           response.send({
               result: res
           });
        });
    });

    router.all('/', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        next();
    });

    /* PAYMENT */
    router.post("/payment", cors(), async (request, response) => {
        /* Add order to database */
        const { sessionId } = request.body;

        /* Generate SHA-384 checksum */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            let crc = res[0].crc;
            let marchantId = res[0].marchant_id;

            console.log(crc);
            console.log(marchantId);

            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","merchantId":${marchantId},"amount":${parseFloat(request.body.amount)*100},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash = data.digest('hex');

            /* Dane */
            let postData = {
                sessionId: sessionId,
                posId: marchantId,
                merchantId: marchantId,
                amount: parseFloat(request.body.amount) * 100,
                currency: "PLN",
                description: "Platnosc za zakupy w sklepie HideIsland",
                email: request.body.email,
                country: "PL",
                language: "pl",
                urlReturn: `${process.env.API_URL}/dziekujemy`,
                urlStatus: `${process.env.API_URL}/payment/verify`,
                sign: gen_hash
            };

            // console.log(postData);
            let responseToClient;

            /* FIRST STEP - REGISTER */
            got.post("https://secure.przelewy24.pl/api/v1/transaction/register", {
                json: postData,
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic MTUyMTE1Ojk5NDQyZmQ3MmQyNzQ3MjE0MDcxNmQwYTlhNDlkMDcw'
                }
            })
                .then(res => {
                    responseToClient = res.body.data.token;
                    response.send({
                        result: responseToClient
                    });
                })
                .catch(err => {
                    console.log(err);
                })
        });

    });

    /* Payment - verify */
    router.post("/verify", async (request, response) => {
        let merchantId = request.body.merchantId;
        let posId = request.body.posId;
        let sessionId = request.body.sessionId;
        let amount = request.body.amount;
        let currency = request.body.currency;
        let orderId = request.body.orderId;

        /* Get data */
        const query = 'SELECT * FROM przelewy24 WHERE id = 1';
        con.query(query, (err, res) => {
            let crc = res[0].crc;

            /* Calculate SHA384 checksum */
            let hash, data, gen_hash;
            hash = crypto.createHash('sha384');
            data = hash.update(`{"sessionId":"${sessionId}","orderId":${orderId},"amount":${amount},"currency":"PLN","crc":"${crc}"}`, 'utf-8');
            gen_hash= data.digest('hex');

            got.put("https://secure.przelewy24.pl/api/v1/transaction/verify", {
                json: {
                    merchantId,
                    posId,
                    sessionId,
                    amount,
                    currency,
                    orderId,
                    sign: gen_hash
                },
                responseType: 'json',
                headers: {
                    'Authorization': 'Basic MTUyMTE1Ojk5NDQyZmQ3MmQyNzQ3MjE0MDcxNmQwYTlhNDlkMDcw' // tmp
                }
            })
                .then(res => {
                    if(res.body.data.status === 'success') {
                        /* Change value in databse - payment complete */
                        const values = [sessionId];
                        const query = 'UPDATE orders SET payment_status = "opłacone" WHERE przelewy24_id = ?';
                        con.query(query, values, (err, res) => {
                            console.log("UPDATING PAYMENT STATUS");
                            console.log(err);
                        });

                        /* Decrement stock */
                        const queryStock = 'SELECT * FROM orders o JOIN sells s ON o.id = s.order_id WHERE przelewy24_id = ?';
                        con.query(queryStock, values, (err, res) => {
                            if(res) {
                                if(res) {

                                }
                            }
                        });
                    }
                    else {
                        const values = [sessionId];
                        const query = 'UPDATE orders SET payment_status = "niepowodzenie" WHERE przelewy24_id = ?';
                        con.query(query, values);
                    }
                })

            response.send({
                status: "OK"
            });
        });
    });
});

module.exports = router;

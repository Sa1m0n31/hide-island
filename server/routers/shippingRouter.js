const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: 'uploads/' });

con.connect((err) => {
    /* UPDATE INFO */
    router.post("/update", (request, response) => {
        let { id, name, price } = request.body;

        const values = [name, price, id];
        const query = 'UPDATE shipping_methods SET name = ?, price = ? WHERE id = ?';
        con.query(query, values, (err, res) => {
           if(res) {
               response.send({
                   result: 1
               });
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* GET INFO */
    router.get("/get-info", (request, response) => {
       const query = 'SELECT * FROM shipping_methods';
       con.query(query, (err, res) => {
          if(res) {
              response.send({
                  result: res
              });
          }
          else {
              response.send({
                  result: 0
              });
          }
       });
    });


    /* ADD SHIPPING METHOD */
    router.post("/add",(request, response) => {
        const {name, price} = request.body;

        const values = [name, price];
        const query = 'INSERT INTO shipping_methods VALUES (NULL, ?, ?)';

        con.query(query, values, (err, res) => {
            if(res) {
                response.send({
                    result: 1
                });
            }
            else {
                response.send({
                    result: 0
                })
            }
        });
    });

    /* GET SINGLE SHIPPING METHOD */
    router.post("/get-shipping-method", (request, response) => {
        const { id } = request.body;

        const values = [id];
        const query = 'SELECT * FROM shipping_methods WHERE id = ?';
        con.query(query, values, (err, res) => {
           if(res) {
               response.send({
                   result: res[0]
               });
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* GET ALL SHIPPING METHODS */
    router.get("/get-all-shipping-methods", (request, response) => {
        con.query(`SELECT sm.id, sm.name, sm.price, sm.delivery_time, i.file_path as img_path FROM shipping_methods sm LEFT OUTER JOIN images i ON sm.image = i.id`, (err, res) => {
            let result, shippingMethods = 0;
           if(err) result = 0;
           else {
               result = 1;
               shippingMethods = res;
           }
           response.send({
               result,
               shippingMethods
           });
        });
    });

    /* DELETE SHIPPING METHOD */
    router.post("/delete", (request, response) => {
        const id = request.body.id;
        const values = [id];
        const query = 'DELETE FROM shipping_methods WHERE id = ?';

        con.query(query, values, (err, res) => {
            console.log(err);
            console.log(res);
            let result = 0;
            if(!err) result = 1;
            response.send({
                result
            });
        });
    });
});

module.exports = router;

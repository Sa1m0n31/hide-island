const express = require("express");
const router = express.Router();
const got = require("got");
const con = require("../databaseConnection");

con.connect(err => {
    /* Get all stocks */
    router.get("/get-all", (request, response) => {
        const query = 'SELECT * FROM products_stock';
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
        })
    });

    /* Get single stock */
    router.post("/get-single", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'SELECT * FROM products_stock WHERE id = ?';
       con.query(query, values, (err, res) => {
          if(res) {
              console.log(res);
              response.send({
                  result: res[0]
              });
          }
          else {
              console.log(err);
              response.send({
                  result: 0
              });
          }
       });
    });

    /* Add stock */
    router.post("/add", (request, response) => {
        const { products, name, size1Name, size1Stock, size2Name, size2Stock, size3Name, size3Stock, size4Name, size4Stock, size5Name, size5Stock } = request.body;

        /* products - array of numbers (ids) - [1, 14, 4] */
        console.log(products);

        /* 1 - Add new stock */
        const values = [name, size1Name, size1Stock, size2Name, size2Stock, size3Name, size3Stock, size4Name, size4Stock, size5Name, size5Stock];
        const query = 'INSERT INTO products_stock VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        con.query(query, values, (err, res) => {
            console.log(err);
            if(res) {
                const stockId = res.insertId;
                /* 2 - Add that stock to existing products */
                products.forEach((item, index, array) => {
                    const values = [stockId, item];
                    const query = 'UPDATE products SET stock_id = ? WHERE id = ?';
                    con.query(query, values, (err, res) => {
                        if(index === array.length-1) {
                            response.send({
                                result: 1
                            });
                        }
                    });
                });
            }
            else {
                response.send({
                    result: 0
                });
            }
        });
    });

    /* Update stock */
    router.post("/update", (request, response) => {
       const { id, name, products, size1Name, size1Stock, size2Name, size2Stock, size3Name, size3Stock, size4Name, size4Stock, size5Name, size5Stock } = request.body;

        /* 1 - update stock */
        const values = [name, size1Name, size1Stock, size2Name, size2Stock, size3Name, size3Stock, size4Name, size4Stock, size5Name, size5Stock, id];
        const query = 'UPDATE products_stock SET name = ?, size_1_name = ?, size_1_stock = ?, size_2_name = ?, size_2_stock = ?, size_3_name = ?, size_3_stock = ?, size_4_name = ?, size_4_stock = ?, size_5_name = ?, size_5_stock = ? WHERE id = ?';
        con.query(query, values, (err, res) => {
           if(res) {
               /* 2 - delete old products stocks from PRODUCTS table */
               const values = [id];
               const query = 'UPDATE products SET stock_id = NULL WHERE stock_id = ?';
               con.query(query, values, (err, res) => {
                    if(res) {
                        console.log(products);
                        /* 3 - add new products stocks to PRODUCTS table */
                        products.forEach((item, index, array) => {
                            const values = [id, item];
                            const query = 'UPDATE products SET stock_id = ? WHERE id = ?';
                            con.query(query, values);
                            /* Check if need to send notification */
                            got.post("https://hideisland.pl/notification/check-notifications", {
                                json: { productId: item },
                                responseType: "json"
                            });
                            if(index === array.length-1) {
                                response.send({
                                    result: 1
                                });
                            }
                        });
                    }
                    else {
                        response.send({
                            result: 0
                        });
                    }
               });
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    });

    /* Delete stock */
    router.post("/delete", (request, response) => {
       const { id } = request.body;

       const values = [id];
       const query = 'DELETE FROM products_stock WHERE id = ?';
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

    /* Get products with given stock */
    router.post("/get-products-with-stock", (request, response) => {
       const { id } = request.body;

       const values = [id];
       const query = 'SELECT id FROM products WHERE stock_id = ?';
       con.query(query, values, (err, res) => {
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

    /* Get stock of given product */
    router.post("/get-product-stock", (request, response) => {
       const { id } = request.body;

       const values = [id];
       const query = 'SELECT * FROM products_stock ps JOIN products p ON ps.id = p.stock_id WHERE p.id = ?';
       con.query(query, values, (err, res) => {
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
});

module.exports = router;

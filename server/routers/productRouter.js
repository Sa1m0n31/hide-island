const express = require("express");
const router = express.Router();
const multer = require("multer");
const con = require("../databaseConnection");
const path = require("path");

con.connect(err => {
   /* ADD CROSS-SELLS */
   const addCrossSells = (product1, product2) => {
      const values = [product1, product2];
      const query = 'INSERT INTO cross-sells VALUES (NULL, product1, product2)';
      con.query(query, values);
   }

   /* GET NEW ID */
   router.get("/last-product", (request, response) => {
      const query = 'SELECT id FROM products ORDER BY date DESC LIMIT 1';
      con.query(query, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0].id
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   /* Modify IMAGES table */
   // const storage = multer.diskStorage({
   //    destination: "media/products/",
   //    filename: function(req, file, cb){
   //       const fName = file.fieldname + Date.now() + path.extname(file.originalname);
   //       filenames.push(fName);
   //       cb(null, fName);
   //    }
   // });
   //
   // const upload = multer({
   //    storage: storage
   // }).fields([{name: "mainImage"}]);
   //
   // upload(request, response, (err, res) => {
   //    if (err) throw err;
   //
   //    filenames.sort().reverse(); // First image - main image
   //    /* Add images to database */
   //    if(filenames.length) {
   //       filenames.forEach((item, index, array) => {
   //          const values = ["products/" + item, productId];
   //          const query = 'INSERT INTO images VALUES (NULL, ?, ?)';
   //          con.query(query, values);
   //       });
   //    }
   // });

   // var storage = multer.diskStorage({
   //    destination: function (req, file, cb) {
   //       cb(null, './media/products')
   //    },
   //    filename: function (req, file, cb) {
   //       cb(null, file.originalname)
   //    }
   // })
   // var upload = multer({ storage: storage })


   /* ADD PRODUCT */
   router.post("/add-product", (request, response) => {
      let filenames = [];
      let filenamesGallery = [];
      let filesId = [null];

      /* Modify IMAGES table */
      const storage = multer.diskStorage({
         destination: "media/products/",
         filename: function(req, file, cb){
            const fName = file.fieldname + Date.now() + path.extname(file.originalname);
            filenames.push(fName);
            cb(null, fName);
         }
      });

      const upload = multer({
         storage: storage
      }).fields([{name: "mainImage"}]);

      upload(request, response, (err, res) => {
         if (err) throw err;

         /* Prepare */
         console.log(request.body);
         let { id, name, categoryId, price, shortDescription, recommendation, hidden, size1, size2, size3, size4, size5, size1Stock, size2Stock, size3Stock, size4Stock, size5Stock } = request.body;
         hidden = hidden === "hidden";
         recommendation = recommendation === "true";
         categoryId = parseInt(categoryId);

         /* 1st - ADD MAIN IMAGE TO IMAGES TABLE */
         filenames.sort().reverse(); // First image - main image
         if(filenames.length) {
            filenames.forEach((item, index, array) => {
               const values = ["products/" + item];
               const query = 'INSERT INTO images VALUES (NULL, ?, NULL)';
               con.query(query, values, (err, res) => {
                     /* 2nd - ADD PRODUCT TO PRODUCTS TABLE */
                  console.log(err);
                     const insertedMainImageId = res.insertId;
                     const values = [id, name, price, shortDescription, insertedMainImageId, categoryId, recommendation, hidden];
                     const query = 'INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)';
                     con.query(query, values, (err, res) => {
                        if(res) {
                           const productId = res.insertId;

                           /* 3rd - ADD PRODUCT STOCKS TO PRODUCTS_STOCK TABLE */
                           const values2 = [productId, size1, parseInt(size1Stock), size2, parseInt(size2Stock), size3, parseInt(size3Stock), size4, parseInt(size4Stock), size5, parseInt(size5Stock)];
                           const query2 = 'INSERT INTO products_stock VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                           con.query(query2, values2, (err, res) => {
                              console.log("Second error");
                              console.log(err);
                              if(res) response.redirect("http://localhost:3000/panel/dodaj-produkt?add=1");
                              else response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
                           });

                           /* 4th - ADD GALLERY IMAGES */
                        }
                        else {
                           response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
                        }
                     });
               });
            });
         }
         else {
            /* No main image */
         }
      });
   });

   /* UPDATE PRODUCT */
   router.post("/update-product", (request, response) => {
      let { id, name, categoryId, shortDescription, price, recommendation, size1, size2, size3, size4, size5, size1Stock, size2Stock, size3Stock, size4Stock, size5Stock, hidden } = request.body;

      hidden = hidden === "hidden";
      recommendation = recommendation === "true";

      categoryId = parseInt(categoryId);

      /* Add product without main image */
      const values = [name, price, shortDescription, categoryId, recommendation, hidden, id];
      const query = 'UPDATE products SET name = ?, price = ?, ' +
          'description = ?, category_id = ?, ' +
          'recommendation = ?, hidden = ? ' +
          'WHERE id = ?';
      con.query(query, values, (err, res) => {
         console.log("1 error");
         console.log(err);
         /* Update sizes and stock info */
         const valuesSizes = [size1, size2, size3, size4, size5, size1Stock, size2Stock, size3Stock, size4Stock, size5Stock, id];
         const querySizes = 'UPDATE products_stock SET size_1_name = ?, size_2_name = ?, size_3_name = ?, size_4_name = ?, size_5_name = ?, ' +
             'size_1_stock = ?, size_2_stock = ?, size_3_stock = ?, size_4_stock = ?, size_5_stock = ? WHERE product_id = ?';

         con.query(querySizes, valuesSizes, (err, res) => {
            console.log("2 error");
            console.log(err);
            if(res) response.redirect("http://localhost:3000/panel/dodaj-produkt?add=1");
            else response.redirect("http://localhost:3000/panel/dodaj-produkt?add=0");
         });
      });
   });

   /* REMOVE PRODUCT */
   router.post("/delete", (request, response) => {
      const { id } = request.body;
      const values = [id];

      const query = 'DELETE FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         let result = 0;
         if(res) result = 1;
         response.send({
            result
         });
      });
   });

   /* REMOVE CURRENT CROSS-SELLS */
   const deleteCrossSellsForProduct = (productId) => {
      const values = [productId];
      const query = 'DELETE FROM cross-sells WHERE product1 = ?';
      con.query(query, values);
   }

   /* GET ALL PRODUCTS */
   router.get("/get-all-products", (request, response) => {
      const query = 'SELECT p.id, p.name, i.file_path as image, p.price, p.date, COALESCE(c.name, "Brak") as category_name, p.hidden FROM products p ' +
      'LEFT OUTER JOIN categories c ON p.category_id = c.id ' +
      'LEFT OUTER JOIN images i ON p.main_image = i.id ORDER BY p.date DESC';

      con.query(query, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* GET SINGLE PRODUCT BY ID */
   router.post("/get-product-by-id", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT name FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
            response.send({
               result: res[0].name
            });
         }
         else {
            response.send({
               result: 0
            });
         }
      })
   });

   /* GET SINGLE PRODUCT BY NAME */
   router.post("/get-product-by-name", (request, response) => {
      const { name } = request.body;
      const values = [name];
      console.log(name);
      /* Query uses custom MySQL function - SPLIT_STR */
      const query = 'SELECT p.id as id, p.name, p.price, ' +
          'p.description, p.category_id, p.date, i.file_path as file_path, ' +
          's.size_1_name, s.size_2_name, s.size_3_name, s.size_4_name, s.size_5_name, ' +
          's.size_1_stock, s.size_2_stock, s.size_3_stock, s.size_4_stock, s.size_5_stock ' +
          'FROM products p LEFT OUTER JOIN images i ON i.id = p.main_image ' +
          'LEFT OUTER JOIN products_stock s ON p.id = s.product_id ' +
          'WHERE LOWER(SPLIT_STR(p.name, "/", 1)) = ?';
      con.query(query, values, (err, res) => {
         console.log(err);
         response.send({
            result: res
         });
      });
   });

   /* GET IMAGE BY ID */
   router.post("/get-image", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT file_path FROM images WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res[0]) {
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

   /* GET SINGLE PRODUCT DETAILS (CLIENT) */
   router.post("/single-product", (request, response) => {
      const { id } = request.body;
      console.log(request.body);
      const values = [id];
      const query = 'SELECT p.id as id, p.name, p.price, ' +
          'p.description, p.category_id, p.date, p.recommendation, ' +
          'i.file_path as file_path, s.size_1_name, s.size_1_stock, s.size_2_name, s.size_2_stock, s.size_3_name, s.size_3_stock, s.size_4_name, s.size_4_stock, s.size_5_name, s.size_5_stock ' +
          'FROM products p ' +
          'LEFT OUTER JOIN images i ON i.id = p.main_image ' +
          'LEFT OUTER JOIN products_stock s ON p.id = s.product_id ' +
          'WHERE p.id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            console.log(res);
            console.log(err);
            response.send({
               result: res
            });
         }
         else {
            console.log(err);
            response.send({
               result: null
            });
         }
      });
   });

   /* GET PRODUCT DETAILS */
   router.post("/product-data", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM products WHERE id = ?';
      con.query(query, values, (err, res) => {
         if(res) {
            response.send({
               result: res
            });
         }
         else {
            response.send({
               result: null
            });
         }
      });
   });

   /* GET PRODUCTS BY CATEGORY */
   router.post("/get-products-by-category", (request, response) => {
      const { id } = request.body;
      const values = [id];
      const query = 'SELECT * FROM products WHERE category_id = ?';
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
   })
});

module.exports = router;

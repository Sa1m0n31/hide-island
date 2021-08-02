const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const con = require("../databaseConnection");

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

con.connect(err => {
    /* ADD NOTIFICATION */
    router.post("/add", (request, response) => {
       const { productId, email } = request.body;

       const values = [productId, email];
       const query = 'INSERT INTO notifications VALUES (NULL, ?, ?)';
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

    const convertToURL = (str) => {
        if(str) return str.toLowerCase()
            .replace(/ /g, "-")
            .replace(/ą/g, "a")
            .replace(/ć/g, "c")
            .replace(/ę/g, "e")
            .replace(/ł/g, "l")
            .replace(/ń/g, "n")
            .replace(/ó/g, "o")
            .replace(/ś/g, "s")
            .replace(/ź/g, "z")
            .replace(/ż/g, "z")
        else return "";
    }

    const sendMail = (email, productName) => {
        /* Nodemailer */
        let transporter = nodemailer.createTransport(smtpTransport ({
            auth: {
                user: 'test@skylo-test2.pl',
                pass: 'HideIsland-31'
            },
            host: 'skylo-pl.atthost24.pl',
            secureConnection: true,
            port: 587,
            tls: {
                rejectUnauthorized: false
            },
        }));

        const productURL = convertToURL(productName);

        let mailOptions = {
            from: 'test@skylo-test2.pl',
            to: email,
            subject: 'Produkt, którego szukałeś, jest już dostępny w naszym sklepie!',
            html: '<h2>Dobre wieści!</h2> ' +
                '<p>Produkt, którego szukałeś/aś,' + productName + ', jest już dostępny na naszej stronie! Możesz go zakupić, klikając w poniższy link: </p> ' +
                '<a href="http://hideisland.skylo-test3.pl/produkt/' + productURL +'">' +
                 'PRZEJDŹ DO PRODUKTU' +
                ' </a>'
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
            }else{
                console.log("success");
            }
        });
    }

    /* CHECK NOTIFICATIONS AFTER PRODUCT STOCK MODIFICATION */
    router.post("/check-notifications", (request, response) => {
       const { productId } = request.body;

       /* 1. Check if product has more than 0 stock */
       const values1 = [productId];
       const query1 = 'SELECT size_1_stock, size_2_stock, size_3_stock, size_4_stock, size_5_stock FROM products_stock WHERE product_id = ? AND (size_1_stock > 0 OR size_2_stock > 0 OR size_3_stock > 0 OR size_4_stock > 0 OR size_5_stock > 0)';
       con.query(query1, values1, (err, res) => {
            if(res) {
                if(res[0]) {
                    const values2 = [productId];
                    const query2 = 'SELECT n.email, p.name FROM notifications n JOIN products p ON n.product_id = p.id WHERE product_id = ?';

                    con.query(query2, values2, (err, res) => {
                       if(res) {
                           if(res.length) {
                               res.forEach((item, index, array) => {
                                   sendMail(item.email, item.name);

                                   if(index === array.length-1) {
                                       /* Remove all notifications rows */
                                       const values3 = [productId];
                                       const query3 = 'DELETE FROM notifications WHERE product_id = ?';
                                       con.query(query3, values3, (err, res) => {
                                           console.log(err);
                                           response.send({
                                               result: 1
                                           });
                                       });
                                   }
                               });
                           }
                           else {
                               response.send({
                                   result: 1
                               });
                           }
                       }
                       else {
                           response.send({
                               result: 1
                           });
                       }
                    });
                }
            }
            else {
                response.send({
                    result: 1
                });
            }
       });
    });
});

module.exports = router;

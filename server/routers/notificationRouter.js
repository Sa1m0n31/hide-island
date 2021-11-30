const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

con.connect(err => {
    /* Nodemailer */
    let transporter = nodemailer.createTransport(smtpTransport ({
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASSWORD
        },
        host: process.env.HOST,
        secureConnection: true,
        port: 465,
        tls: {
            rejectUnauthorized: false
        },
    }));

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

    const sendStatus1Email = (email) => {
        /* status = ZŁOŻONE */
    }

    const sendStatus2Email = (email) => {
        /* status = PRZYJĘTE DO REALIZACJI */
    }

    const sendMail = (email, productName) => {
        const productURL = convertToURL(productName);

        let mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'Produkt, którego szukałeś, jest już dostępny w naszym sklepie!',
            html: `<main>
                <header style="max-width: 900px; box-sizing: border-box;">
                    <img style="width: 100%;
    transform: scaleY(1.03);" src="https://hideisland.pl/image?url=/media/notification/logo.jpg" alt="hideisland-logo"/>
                </header>
                <section style="background: #D9D9D9; padding: 30px; max-width: 900px; box-sizing: border-box;">
                    <h1 class="notification__header" style="margin: 0 0 20px; font-weight: 900; font-size: 1.5rem; color: #313131;">
                        Twój ulubiony produkt już na Ciebie czeka!
                    </h1>

                    <a style="display: inline-block; text-decoration: none;font-size: 21px; font-weight: 700; color: #313131; margin: 20px 0;" href="https://hideisland.pl/sklep">
                        Kliknij tutaj, aby przejść do sklepu
                        <img style=" width: 50px; height: auto; margin-left: 20px; vertical-align: middle;" src="https://hideisland.pl/image?url=/media/notification/right-arrow.png" alt="przejdz-do-sklepu"/>
                    </a>

                    <section style="display: flex; height: 260px; overflow: hidden; margin: 30px auto;">
                        <figure style="overflow: hidden; display: block; margin: 0; margin-right: 15px;">
                            <img style="width: 100%; display: block;" src="https://hideisland.pl/image?url=/media/notification/bluza-biala.jpg"/>
                        </figure>
                        <figure style="overflow: hidden; display: block; margin: 0;">
                            <img style="max-width: 200%; min-width: 100%; min-height: 85%; display: block;" src="https://hideisland.pl/image?url=/media/notification/metka.jpg"/>
                        </figure>
                    </section>
                    <figure style="overflow: hidden; display: block; height: 300px; margin: 0; margin-top: 20px;">
                        <img style="width: 100%; display: block;" src="https://hideisland.pl/image?url=/media/notification/wieszak.jpg"/>
                    </figure>

                    <h2 class="notification__secondHeader" style="color: #313131; font-size: 1.2rem; font-weight: 700; margin: 20px 0;">
                        Zainspiruj się i bądź na bieżąco
                    </h2>

                    <section>
                        <a style="color: #313131; font-size: 13px; white-space: nowrap; display: block;width: 49%;text-decoration: none;margin-bottom: 20px;" href="https://www.facebook.com/HideIslandwear">
                            <img style=" width: 30px;height: auto;margin-right: 8px;vertical-align: middle;" src="https://hideisland.pl/image?url=/media/notification/fb.png" alt="facebook"/>
                            Hideislandwear
                        </a>
                        <a style="color: #313131;font-size: 13px; white-space: nowrap; display: block;width: 49%;text-decoration: none;margin-bottom: 20px;" href="https://hideisland.pl">
                            <img style=" width: 30px;height: auto;margin-right: 8px;vertical-align: middle;" src="https://hideisland.pl/image?url=/media/notification/website.png" alt="strona-internetowa"/>
                            www.hideisland.pl
                        </a>
                    </section>
                     <a style="color: #313131;font-size: 13px; white-space: nowrap; display: block;width: 100%;text-decoration: none;margin-bottom: 20px;"
                           href="https://www.instagram.com/HideIsland_wear/?fbclid=IwAR3Y8NLYGmXQ-_pvGE1UZLO1oR0iMfT0uNWYZgvrpKHv40N4fKvsfdC4UPc">
                            <img style=" width: 30px;height: auto;margin-right: 8px;vertical-align: middle;" src="https://hideisland.pl/image?url=/media/notification/insta.png" alt="instagram"/>
                            Hideislandwear
                    </a>
                </section>
            </main>`
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
       const query1 = 'SELECT size_1_stock, size_2_stock, size_3_stock, size_4_stock, size_5_stock FROM products_stock ps JOIN products p ON ps.id = p.stock_id WHERE p.id = ? AND (ps.size_1_stock > 0 OR ps.size_2_stock > 0 OR ps.size_3_stock > 0 OR ps.size_4_stock > 0 OR ps.size_5_stock > 0)';
       con.query(query1, values1, (err, res) => {
            if(res) {
                if(res[0]) {
                    const values2 = [productId];
                    const query2 = 'SELECT n.email, p.name FROM notifications n JOIN products p ON n.product_id = p.id WHERE product_id = ?';

                    con.query(query2, values2, (err, res) => {
                        console.log(res);
                        console.log(err);
                       if(res) {
                           if(res.length) {
                               res.forEach((item, index, array) => {
                                   sendMail(item.email, item.name);

                                   if(index === array.length-1) {
                                       /* Remove all notifications rows */
                                       const values3 = [productId];
                                       const query3 = 'DELETE FROM notifications WHERE product_id = ?';
                                       con.query(query3, values3, (err, res) => {
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

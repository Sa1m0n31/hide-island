const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

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

con.connect(err => {
    const sendVerificationMail = (email, token, response) => {
        let mailOptions = {
            from: process.env.MAIL,
            to: email,
            subject: 'Potwierdź swój adres e-mail',
            html: `<head>
    <meta charSet="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap"
          rel="stylesheet">
          <style>
          @media(max-width: 768px) {
            * {
                font-size: 14px;
            }
            
            tfoot tr td {
                font-size: 10px;
            }
          }
</style>
</head>
<body>
<main style="width: 100%; max-width: 600px;">
    <img style="max-width: 100%; width: 800px; margin: 0;" src="https://hideisland.pl/image?url=/media/notification/logo.jpg" alt="zamowienie-zostalo-zlozone"/>
    <table
            style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #59545A; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead style="display: block;">
        <tr style="display: block;">
            <th style="font-weight: 700; font-size: 32px; display: block; margin-top: 20px; text-align: left;">
                Cześć,
            </th>
        </tr>
        </thead>
        <tbody style="display: block;">
        <tr style="display: block;">
            <td style="display: block; margin-top: 25px; font-size: 20px; font-weight: 400;">
                zanim zaczniemy wysyłać Ci informacje o nowościach i rabatach musimy potwierdzić Twój adres e-mail, aby mieć pewność, że to na pewno Ty.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block;">
            <td style="display: block; width: 100%; max-width: 350px; height: 60px; background: #000; margin: 40px auto;">
                <a style="display: block; height: 100%; background: #000; text-decoration: none; color: #fff; font-weight: 700; line-height: 60px; font-size: 24px; text-align: center; vertical-align: middle; cursor: pointer;" target="_blank" href="https://hideisland.pl/potwierdzenie-subskrypcji-newslettera?token=${token}">
                    Potwierdź adres email
                </a>
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; position: relative; padding-left: 70%; margin-top: 20px;">
            <td style="display: inline-block; margin-right: 20px;">
                <a href="https://www.facebook.com/HideIslandwear" target="_blank">
                    <img style="width: 40px; height: 40px; display: block;" src="https://hideisland.pl/image?url=/media/notification/facebook-color.png" alt="facebook" />
                </a>
            </td>
            <td style="display: inline-block; margin-right: 20px;">
                <a href="https://www.instagram.com/HideIsland_wear/?fbclid=IwAR3Y8NLYGmXQ-_pvGE1UZLO1oR0iMfT0uNWYZgvrpKHv40N4fKvsfdC4UPc" target="_blank">
                    <img style="width: 40px; height: 40px; display: block;" src="https://hideisland.pl/image?url=/media/notification/instagram-color.png" alt="instagram" />
                </a>
            </td>
            <td style="display: inline-block;">
                <a href="https://hideisland.pl" target="_blank">
                    <img style="width: 40px; height: 40px; display: block;" src="https://hideisland.pl/image?url=/media/notification/world-wide-web-color.png" alt="hideisland" />
                </a>
            </td>
        </tr>
        </tbody>
        <tfoot style="display: block;">
        <tr style="display: block;">
            <td style="font-size: 12px; margin-top: 50px; display: block; text-align: center">
                Ten mail został wygenerowany automatycznie. Prosimy na niego nie odpowiadać.
            </td>
        </tr>
        </tfoot>
    </table>
</main>
</body>`
        }

        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                if(response) {
                    response.send({
                        result: 0
                    })
                }
            }
            else{
                if(response) {
                    response.send({
                        result: 1
                    })
                }
            }
        });
    }

    const sendMailWithDiscountCode = (email, resignToken, response) => {
        /* Create discount code */
        const discountCode = Math.floor(100000 + Math.random() * 900000);

        const query = 'INSERT INTO coupons VALUES (NULL, ?, NOW() - INTERVAL 3 DAY, NOW() + INTERVAL 365 DAY, 5, NULL, 1)';
        const values = [discountCode];

        con.query(query, values, (err, res) => {
           if(res) {
               let mailOptions = {
                   from: process.env.MAIL,
                   to: email,
                   subject: 'Cieszymy się, że jesteś z nami',
                   html: `<head>
    <meta charSet="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap"
          rel="stylesheet">
</head>
<body>
<main style="width: 100%; max-width: 600px;">
    <img style="max-width: 100%; width: 800px; margin: 0;" src="https://hideisland.pl/image?url=/media/notification/logo.jpg" alt="zamowienie-zostalo-zlozone"/>
    <table
            style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #59545A; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead style="display: block;">
        <tr style="display: block;">
            <th style="font-weight: 700; font-size: 32px; display: block; margin-top: 20px; text-align: left;">
                Cześć,
            </th>
        </tr>
        </thead>
        <tbody style="display: block;">
        <tr style="display: block;">
            <td style="display: block; margin-top: 25px; font-size: 20px; font-weight: 400;">
                cieszymy się, że jesteś z nami! Będziemy Cię informować o nowościach i promocjach na naszym sklepie.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; margin: 20px auto;">
            <td style="display: block; text-align: center; font-weight: 700; font-size: 21px;">
                Oto Twój kod rabatowy na pierwsze zakupy!
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; margin: 20px auto;">
            <td style="display: block; width: 80px; margin: auto; text-align: center; font-weight: 400; font-size: 28px; border-bottom: 1px solid #fff; padding-bottom: 10px;">
                - 5%
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block;">
            <td style="display: block; font-size: 26px; margin: 20px auto; font-weight: 700; width: 300px; height: 60px; line-height: 60px; text-align: center; border: 1px solid #fff; border-radius: 5px;">
                ${discountCode}
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block;">
            <td style="display: block; margin: 20px auto; width: 400px;">
                <a style="color: #fff; text-decoration: none; font-size: 21px; text-align: center; max-width: 95%;" target="_blank" href="https://hideisland.pl">
                    Kliknij tutaj aby przejść do sklepu
                    <img style="vertical-align: middle; width: 50px; height: auto; margin-left: 20px;" src="https://hideisland.pl/image?url=/media/notification/arrow-right-long.png" alt="przejdz-do-sklepu" />
                </a>
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; position: relative; margin-top: 20px; padding-left: 70%;">
            <td style="display: inline-block; margin-right: 20px;">
                <a href="https://www.facebook.com/HideIslandwear" target="_blank">
                    <img style="width: 40px; height: 40px; display: block;" src="https://hideisland.pl/image?url=/media/notification/facebook-color.png" alt="facebook" />
                </a>
            </td>
            <td style="display: inline-block; margin-right: 20px;">
                <a href="https://www.instagram.com/HideIsland_wear/?fbclid=IwAR3Y8NLYGmXQ-_pvGE1UZLO1oR0iMfT0uNWYZgvrpKHv40N4fKvsfdC4UPc" target="_blank">
                    <img style="width: 40px; height: 40px; display: block;" src="https://hideisland.pl/image?url=/media/notification/instagram-color.png" alt="instagram" />
                </a>
            </td>
        </tr>
        </tbody>
        <tfoot style="display: block;">
        <tr style="display: block;">
            <td style="font-size: 12px; margin-top: 50px; display: block; text-align: center">
                Otrzymałeś/aś tego maila, ponieważ zapisałeś/aś się do newslettera na naszej stronie internetowej HideIsland.pl
            </td>
        </tr>
        <tr style="display: block;">
            <td style="font-size: 12px; margin-top: 15px; display: block; text-align: center">
                Nie chcesz otrzymywać od nas żadnych e-maili? W każdej chwili możesz <a style="color: #fff; text-decoration: underline;" href="https://hideisland.pl/rezygnacja-z-subskrypcji?token=${resignToken}">zrezygnować z subskrypcji</a> wszystkich komercyjnych wiadomości przesyłanych przez Hideisland.pl
            </td>
        </tr>
        <tr style="display: block;">
            <td style="font-size: 12px; margin-top: 15px; display: block; text-align: center">
                Ten e-mail został wygenerowany automatycznie. Prosimy na niego nie odpowiadać.
            </td>
        </tr>
        </tfoot>
    </table>
</main>
</body>
`
               }

               transporter.sendMail(mailOptions, function(error, info){
                   if(error) {
                       if(response) {
                           response.send({
                               result: 0
                           })
                       }
                   }
                   else{
                       if(response) {
                           response.send({
                               result: 1
                           })
                       }
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

    /* Verify subscription (click in verification link) */
    router.post("/verify-subscription", (request, response) => {
       const { token } = request.body;

       const query = 'SELECT email, resign_token FROM newsletter WHERE token = ?';
       const values = [token];

       con.query(query, values, (err, res) => {
           if(res) {
               const email = res[0].email;
               const resignToken = res[0].resign_token;

               /* Change token value in database */
               const query = 'UPDATE newsletter SET token = NULL WHERE token = ?';
               const values = [token];
               con.query(query, values, (err, res) => {
                    if(res) {
                        sendMailWithDiscountCode(email, resignToken, response);
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

    router.post("/resign", (request, response) => {
        const { resignToken } = request.body;

        const query = 'UPDATE newsletter SET resign_token = NULL WHERE resign_token = ?';
        const values = [resignToken];

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
    })

    /* Get all emails */
    router.get("/get-all", (request, response) => {
        const query = 'SELECT * FROM newsletter WHERE token IS NULL AND resign_token IS NOT NULL ORDER BY id DESC';
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
    })

    /* Add mail to newsletter */
    router.post('/add', (request, response) => {
       const email = request.body.email;
       const token = uuidv4();
       const resignToken = uuidv4();

       const query = 'INSERT INTO newsletter VALUES (NULL, ?, ?, ?)';
       const values = [email, token, resignToken];
       con.query(query, values, (err, res) => {
           if(res) {
               sendVerificationMail(email, token, response);
           }
           else {
               if(err.errno === 1062) {
                   response.send({
                       result: -1
                   });
               }
               else {
                   response.send({
                       result: err
                   });
               }
           }
       });
    });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const got = require("got");
const con = require("../databaseConnection");

const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');

/* Nodemailer */
let transporter = nodemailer.createTransport(smtpTransport ({
    auth: {
        user: 'powiadomienia@skylo-pl.atthost24.pl',
        pass: 'SwinkaPeppa-31'
    },
    host: 'skylo-pl.atthost24.pl',
    secureConnection: true,
    port: 465,
    tls: {
        rejectUnauthorized: false
    },
}));

const sendStatus3Email = (id, email, fullName, letterNumber, response = null) => {
    /* status = ZREALIZOWANE */
    let mailOptions = {
        from: 'powiadomienia@skylo-pl.atthost24.pl',
        to: email,
        subject: 'Twoje zamówienie zostało zrealizowane',
        html: `<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap" rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <img style="max-width: 100%; width: 800px; margin: 0;" src="http://hideisland.skylo-test3.pl/image?url=/media/notification/logo.jpg" alt="zamowienie-zostalo-zrealizowane" />
    <table style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #59545A; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead>
            <tr>
               <th style="font-weight: 300; display: block; margin-top: 20px; text-align: left;">
                   Dzień dobry, ${fullName}
               </th>
            </tr>
            <tr>
                <th style="font-weight: 700; display: block; margin: 30px 0; text-align: left">
                    Twoje zamówienie #${id} zostało zrealizowane!
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    Paczka jest gotowa do wysyłki i oczekuje na kuriera!
                    Informacje o etapach dostarczenia przesyłki dostaniesz bezpośrednio od przewoźnika na adres mailowy podany przy zamówieniu.
                </td>
            </tr>
            <tr>
                <td style="display: block; margin: 20px 0;">
                    Numer listu przewozowego: ${letterNumber}
                </td>
            </tr>
            <tr>
                <td>
                    <a target="_blank" style="color: #fff;" href="https://inpost.pl/sledzenie-przesylek?number=${letterNumber}">
                        Śledź paczkę
                    </a>
                </td>
            </tr>
            <tr>
                <td style="display: block; margin-top: 20px; font-weight: 700;">
                    Ważne!
                </td>
            </tr>
            <tr>
                <td>
                    Śledzenie przesyłki na stronach firmy przewozowej możliwe jest najwcześniej w godzinach wieczornych w dniu nadania.
                </td>
            </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
            <tr>
                <td style="display: block; margin-top: 20px;">
                    Pozdrawiamy
                </td>
            </tr>
            <tr>
                <td>
                    Zespół HideIsland
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;" href="https://hideisland.pl">
                        hideisland.pl
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; text-decoration: none;" href="mailto:biuro@hideisland.pl">
                        biuro@hideisland.pl
                    </a>
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

const sendStatus2Email = (id, email, fullName, response = null) => {
    /* status = PRZYJĘTE DO REALIZACJI */
    let mailOptions = {
        from: 'powiadomienia@skylo-pl.atthost24.pl',
        to: email,
        subject: 'Twoje zamówienie zostało przyjęte do realizacji',
        html: `<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap" rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <img style="max-width: 100%; width: 800px; margin: 0;" src="http://hideisland.skylo-test3.pl/image?url=/media/notification/logo.jpg" alt="zamowienie-zostalo-zrealizowane" />
    <table style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #59545A; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead>
            <tr>
               <th style="font-weight: 300; display: block; margin-top: 20px; text-align: left;">
                   Dzień dobry, ${fullName}
               </th>
            </tr>
            <tr>
                <th style="font-weight: 700; display: block; margin: 30px 0; text-align: left">
                    Twoje zamówienie #${id} zmieniło status na <b>przyjęte do realizacji</b>!
                </th>
            </tr>
        </thead>
        <tbody style="display: block; width: 100%;">
            <tr>
                <td>
                    W przypadku pytań lub wątpliwości prosimy o kontakt pod adresem e-mail: <a href="mailto:biuro@hideisland.pl" style="color: #fff; text-decoration: none;">biuro@hideisland.pl</a>.
                </td>
            </tr>
            <tr style="display: block; width: 100%;">
                <td style="display: block; margin-top: 20px; font-weight: 700; font-size: 17px; width: 100%; text-align: center;">
                    O następnych etapach realizacji zamówienia poinformujemy Ciebie w kolejnym mailu.
                </td>
            </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
            <tr>
                <td style="display: block; margin-top: 20px;">
                    Pozdrawiamy
                </td>
            </tr>
            <tr>
                <td>
                    Zespół HideIsland
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;" href="https://hideisland.pl">
                        hideisland.pl
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    <a style="color: #fff; text-decoration: none;" href="mailto:biuro@hideisland.pl">
                        biuro@hideisland.pl
                    </a>
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

const sendStatus1Email = (orderInfo, response = null) => {
    console.log(orderInfo);
    let sells = ``;
    let sum = 0;
    for(let i=0; i<orderInfo.length; i++) {
        sells += `<tr>
            <td>
                ${orderInfo[i].name}
            </td>
            <td style="font-weight: 700; font-size: 15px; text-align: center; width: 110px;">${orderInfo[i].size}</td>
            <td style="font-weight: 700; font-size: 15px; text-align: center; width: 110px;">${orderInfo[i].quantity}</td>
            <td style="font-weight: 700; font-size: 15px; text-align: center; width: 110px;">${orderInfo[i].price} PLN</td>
            <td style="font-weight: 700; font-size: 15px; text-align: center; width: 110px;">${orderInfo[i].price * orderInfo[i].quantity} PLN</td>
        </tr>`;

        sum += parseInt(orderInfo[i].quantity) * parseInt(orderInfo[i].price);
    }

    let discount = sum + parseInt(orderInfo[0].shipping_method_price) - parseInt(orderInfo[0].order_price);
    const address = orderInfo[0].building.toString() + (orderInfo[0].flat ? "/" + orderInfo[0].flat : "");
    const vat = orderInfo[0].company_name ? `${orderInfo[0].companyName}<br/>${orderInfo[0].nip}` : "Nie dotyczy";
    const inPost = orderInfo[0].inpost_address ? `${orderInfo[0].inpost_address}<br/>${orderInfo[0].inpost_postal_code} ${orderInfo[0].inpost_city}` : "Nie dotyczy";

    /* status = ZŁOŻONE */
    let mailOptions = {
    from: 'powiadomienia@skylo-pl.atthost24.pl',
    to: orderInfo[0].email,
    subject: 'Dziękujemy za złożenie zamówienia w sklepie HideIsland',
    html: `<head>
    <meta charSet="UTF-8">
        <title>Title</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin>
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;700;1,300&display=swap"
                      rel="stylesheet">
</head>
<body>
<main style="width: 100%;">
    <img style="max-width: 100%; width: 800px; margin: 0;" src="http://hideisland.skylo-test3.pl/image?url=/media/notification/logo.jpg" alt="zamowienie-zostalo-zlozone"/>
    <table
        style="display: block; padding: 20px; max-width: 100%; width: 800px; background: #59545A; margin-top: -5px; color: #fff; font-weight: 300; font-family: 'Open Sans', sans-serif;">
        <thead style="display: block;">
        <tr style="display: block;">
            <th style="font-weight: 300; font-size: 21px; display: block; margin-top: 20px; text-align: center;">
                Dziękujemy za zamówienie w sklepie HideIsland.pl
            </th>
        </tr>
        <tr style="display: block;">
            <th style="font-weight: 300; display: block; font-size: 21px; text-align: center;">
                Poniżej znajdują się szczegóły Twojego zamówienia.
            </th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td style="display: block; margin-top: 25px; font-weight: 700;">
                Kupione przedmioty:
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        ${sells}
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="display: block; margin-top: 15px;">
            <td style="font-size: 14px; width: 150px;">
                Wartość produktów:
            </td>
            <td style="font-size: 14px;">
                ${sum} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px;">
            <td style="font-size: 14px; width: 150px;">
                Rabat - kod rabatowy:
            </td>
            <td style="font-size: 14px;">
                - ${discount} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px;">
            <td style="font-size: 14px; width: 150px;">
                Koszt dostawy:
            </td>
            <td style="font-size: 14px;">
                ${orderInfo[0].shipping_method_price} PLN
            </td>
        </tr>
        <tr style="display: block; margin-top: 5px; border-bottom: 3px solid #fff; padding-bottom: 15px;">
            <td style="font-weight: 700; font-size: 15px; width: 150px;">
                Razem
            </td>
            <td style="font-weight: 700; font-size: 15px;">
                ${orderInfo[0].order_price} PLN
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="">
            <td colSpan="1" style="text-align: center; font-size: 14px; font-weight: 700;">Sposób dostawy</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 700;">Szacowany czas dostawy</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 700;">Metoda płatności</td>
        </tr>
        <tr style="">
            <td colSpan="1" style="text-align: center; font-size: 14px; font-weight: 400;">${orderInfo[0].shipping_method}</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 400;">1-2 dni robocze</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 400;">${orderInfo[0].payment_method}</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr style="margin-top: 50px;">
            <td colSpan="1" style="text-align: center; font-size: 14px; font-weight: 700;">Dane odbiorcy przesyłki</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 700;">Dane do faktury</td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 700;">Adres paczkomatu</td>
        </tr>
        <tr style="">
            <td colSpan="1" style="text-align: center; font-size: 14px; font-weight: 400;">
                ${orderInfo[0].first_name} ${orderInfo[0].last_name}<br/>
                ${orderInfo[0].street} ${address}<br/>
                ${orderInfo[0].postal_code} ${orderInfo[0].city}
            </td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 400;">
                ${vat}
            </td>
            <td colSpan="2.5" style="text-align: center; font-size: 14px; font-weight: 400;">
                ${inPost}
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td style="font-size: 14px; font-weight: 700;">Uwagi do zamówienia:</td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td colSpan="5" style="font-size: 14px;">
                Drogi kliencie, realizacja Twojego zamówienia nr: ${orderInfo[0].id} rozpocznie się po zaksięgowaniu płatności na
                naszym koncie. W następnych mailach będziemy Cię informować o kolejnych etapach zamówienia.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td style="font-size: 14px; font-weight: 700;">
                Odstąpienie od umowy
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="font-size: 14px;">
                Czas odstąpienia od umowy to 14 dni. Nie musisz podawać przyczyny i ponosić kosztów za odstąpienie od
                umowy poza kosztem przesyłki. Wystarczy, że w w/w terminie wyślesz stosowne oświadczenie o odstąpieniu
                np. wypełniając formularz, który znajduje się w treści tego maila jako załącznik oraz, który jest
                dostępny na naszej stronie internetowej w zakładce "Reklamacje i zwroty", a następnie odeślesz go nam
                wraz z produktem. Pragniemy zaznaczyć, iż bezpośredni koszt zwrotu produktu leży po Twojej stronie.
            </td>
        </tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px; font-weight: 700;">
                Zwroty i reklamacje prosimy wysyłać na adres:
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px;">
                Topolowa 26
            </td>
        </tr>
        <tr>
            <td colSpan="5" style="text-align: center; font-size: 14px;">
                72-006 Mierzyn
            </td>
        </tr>
        </tbody>
        <tfoot style="display: block; border-top: 2px solid #fff; margin: 20px auto;">
        <tr>
            <td style="display: block; margin-top: 20px;">
                Pozdrawiamy
            </td>
        </tr>
        <tr>
            <td>
                Zespół HideIsland
            </td>
        </tr>
        <tr>
            <td>
                <a style="color: #fff; display: block; margin-top: 20px; text-decoration: none;"
                   href="https://hideisland.pl">
                    hideisland.pl
                </a>
            </td>
        </tr>
        <tr>
            <td>
                <a style="color: #fff; text-decoration: none;" href="mailto:biuro@hideisland.pl">
                    biuro@hideisland.pl
                </a>
            </td>
        </tr>
        </tfoot>
    </table>
</main>
</body>`
    }

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
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

con.connect(err => {
    router.post("/send-order-info", (request, response) => {
        const { orderId } = request.body;

        const query = 'SELECT o.id, o.order_price, p.name, p.price, s.quantity, s.size, pm.name as payment_method, sm.name as shipping_method, sm.price as shipping_method_price, o.inpost_address, o.inpost_postal_code, o.inpost_city, o.nip, o.company_name, u.email, u.first_name, u.last_name, u.street, u.building, u.flat, u.city, u.postal_code FROM orders o JOIN users u ON u.id = o.user JOIN payment_methods pm ON pm.id = o.payment_method JOIN shipping_methods sm ON sm.id = o.shipping_method JOIN sells s ON s.order_id = o.id JOIN products p ON p.id = s.product_id WHERE o.id = ?';
        const values = [orderId];
        con.query(query, values, (err, res) => {
            if(res) {
               sendStatus1Email(res, response);
           }
           else {
               response.send({
                   result: 0
               });
           }
        });
    })

    /* GET ALL ORDERS */
    router.get("/get-orders", (request, response) => {
        const query = 'SELECT o.id as id, u.first_name, u.last_name, u.email, o.date, o.admin_comment, o.payment_status, o.order_status, o.order_comment, o.letter_number FROM orders o LEFT OUTER JOIN users u ON o.user = u.id';
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

    const decrementStock = (productId, size, quantity) => {
        const values = [quantity, productId, size];
        const query1 = 'UPDATE products_stock ps JOIN products p ON ps.id = p.stock_id SET ps.size_1_stock = ps.size_1_stock - ? WHERE p.id = ? AND size_1_name = ?'
        const query2 = 'UPDATE products_stock ps JOIN products p ON ps.id = p.stock_id SET ps.size_2_stock = ps.size_2_stock - ? WHERE p.id = ? AND size_2_name = ?'
        const query3 = 'UPDATE products_stock ps JOIN products p ON ps.id = p.stock_id SET ps.size_3_stock = ps.size_3_stock - ? WHERE p.id = ? AND size_3_name = ?'
        const query4 = 'UPDATE products_stock ps JOIN products p ON ps.id = p.stock_id SET ps.size_4_stock = ps.size_4_stock - ? WHERE p.id = ? AND size_4_name = ?'
        const query5 = 'UPDATE products_stock ps JOIN products p ON ps.id = p.stock_id SET ps.size_5_stock = ps.size_5_stock - ? WHERE p.id = ? AND size_5_name = ?'

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

            if(paymentMethod === 2) {
                /* Jesli za pobraniem - dekrementuj stan magazynowy */
                decrementStock(productId, size, quantity);
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
            if(paymentMethod === 1) {
                /* Payment method - za pobraniem */
                paymentStatus = "za pobraniem";
            }

            building = parseInt(building) || 0;
            let values = [paymentMethod, shippingMethod, city, street, building, flat, postalCode, user, paymentStatus, comment, sessionId, companyName, nip, amount, inPostAddress, inPostCode, inPostCity];
            const query = 'INSERT INTO orders VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, "złożone", CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL)';

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
            const {id, orderStatus, letterNumber, adminComment} = request.body;

            /* Change order status in database */
            const query = 'UPDATE orders SET order_status = ?, letter_number = ?, admin_comment = ? WHERE id = ?';
            const values = [orderStatus, letterNumber, adminComment, id];
            con.query(query, values, (err, res) => {
                if(res) {
                    /* Get order info */
                    const query = 'SELECT * FROM orders o JOIN users u ON o.user = u.id WHERE o.id = ?';
                    const values = [id];

                    con.query(query, values, (err, res) => {
                       if(res) {
                           const firstName = res[0].first_name;
                           const lastName = res[0].last_name;
                           const email = res[0].email;
                           const fullName = firstName + " " + lastName;
                           /* Send email based on order status */
                           if(orderStatus === "przyjęte do realizacji") {
                               sendStatus2Email(id, email, fullName, response);
                           }
                           else if(orderStatus === "zrealizowane") {
                               sendStatus3Email(id, email, fullName, letterNumber, response);
                           }
                           else {
                               response.send({
                                   result: 1
                               });
                           }
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
            const query = 'SELECT o.id, o.admin_comment, o.payment_status, o.order_status, o.letter_number, o.order_comment, u.first_name, u.last_name, u.email, u.phone_number, u.city, u.street, u.building, u.postal_code, u.city, o.date, o.order_status, pm.name as payment, sm.name as shipping, o.order_comment, o.company_name, o.nip, s.size, s.quantity, p.price, p.name, o.inpost_address, o.inpost_postal_code, inpost_city FROM orders o ' +
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
});

module.exports = router;

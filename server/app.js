const express = require("express");
const bodyParser = require("body-parser");
require('dotenv').config()
const cors = require("cors");
const path = require("path");
const auth = require('./auth.js');
const app = express();

const basicAuth = new auth().basicAuth;

/* HTTPS redirection */
// app.enable('trust proxy')
// app.use((req, res, next) => {
//     req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
// });

/* Middleware */
app.use(cors());
app.use(bodyParser({
    limit: "50mb"
}));
app.use(bodyParser.json({
    limit: "50mb"
}));
app.use(bodyParser.raw({
    limit: "50mb"
}));
app.use(bodyParser.text({
    limit: "50mb"
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

/* Serve static frontend */
app.use(express.static(path.join(__dirname, '../client/build')));
app.get("/produkt/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/kategoria/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/sklep", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/regulamin", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/polityka-prywatnosci", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/zwroty-i-reklamacje", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dostawa-i-platnosci", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/koszyk", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dziekujemy", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/zaloguj-sie", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/moje-konto", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/konto-zalozone", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/panel", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/panel/*", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/zarejestruj-sie", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/dziekujemy", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/reklamacje", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/zwroty", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/potwierdzenie-subskrypcji-newslettera", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/rezygnacja-z-subskrypcji", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
app.get("/konkurs", (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

/* Routers */
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const shippingRouter = require("./routers/shippingRouter");
const paymentMethodsRouter = require("./routers/paymetMethodsRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const imageRouter = require("./routers/imageRouter");
const paymentRouter = require("./routers/paymentRouter");
const pagesRouter = require("./routers/pagesRouter");
const couponRouter = require("./routers/couponRouter");
const newsletterRouter = require("./routers/newsletterRouter");
const homepageRouter = require("./routers/homepageRouter");
const notificationRouter = require("./routers/notificationRouter");
const stockRouter = require("./routers/stockRouter");

app.use("/auth", basicAuth, authRouter);
app.use("/user", basicAuth, userRouter);
app.use("/shipping", basicAuth, shippingRouter);
app.use("/payment-methods", basicAuth, paymentMethodsRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/order", basicAuth, orderRouter);
app.use("/image", imageRouter);
app.use("/payment", paymentRouter);
app.use("/pages", pagesRouter);
app.use("/coupon", basicAuth, couponRouter);
app.use("/newsletter", newsletterRouter);
app.use("/homepage", homepageRouter);
app.use("/notification", notificationRouter);
app.use("/stock", basicAuth, stockRouter);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});

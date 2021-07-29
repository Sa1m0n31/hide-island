const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect((err) => {
    /* Edit pages */
    router.post("/update", (request, response) => {
       const { termsOfService, privacyPolicy, complaintsAndReturns, aboutUs } = request.body;

       console.log(request.body);

       const values = [termsOfService, privacyPolicy, complaintsAndReturns, aboutUs];
       const query = 'UPDATE pages SET terms_of_service = ?, privacy_policy = ?, complaints_and_returns = ?, about_us = ? WHERE id = 1';

       con.query(query, values, (err, res) => {
              if(res) response.redirect("http://localhost:5000/panel/pozostale?add=1");
              else response.redirect("http://localhost:5000/panel/pozostale?add=0");
       });

    });

    /* Get pages content */
    router.get("/content", (request, response) => {
       const query = 'SELECT * FROM pages';
       con.query(query, (err, res) => {
          response.send({
              result: res
          });
       });
    });
});

module.exports = router;

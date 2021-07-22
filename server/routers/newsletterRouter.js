const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* Add mail to newsletter */
    router.post('/add', (request, response) => {
       const { email } = request.body;

       const values = [email];
       const query = 'INSERT INTO newsletter VALUES (NULL, ?)';
       con.query(query, values, (err, res) => {
           if(res) {
               response.send({
                   result: 1
               });
           }
           else {
               if(err.errno === 1062) {
                   response.send({
                       result: -1
                   });
               }
               else {
                   response.send({
                       result: 0
                   });
               }
           }
       });
    });
});

module.exports = router;

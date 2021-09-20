const express = require("express");
const crypto = require("crypto");
const got = require("got");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const con = require("../databaseConnection");

con.connect(function(err) {
   const addSessionRow = () => {
       /* Add session row */
       const sessionKey = uuidv4();
       const values = [sessionKey];
       const query = 'INSERT INTO sessions VALUES (NULL, ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE))';
       con.query(query, values);
       return sessionKey;
   }

    const updateSession = (id) => {
       const values = [id];
       const query = 'UPDATE sessions SET expire_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 MINUTE) WHERE id = ?';
       con.query(query, values);
    }

    /* ADD USER */
    router.post("/add-user", (request, response) => {
       const { firstName, lastName, email, phoneNumber, password, postalCode, city, street, building, flat, dupa } = request.body;

       console.log("adding user....");

       console.log(email);

       let hash = null;
       if(password) hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [firstName, lastName, email, hash, city, street, building, flat, postalCode, phoneNumber];
       const query = 'INSERT INTO users VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
       con.query(query, values, (err, res) => {
          if(err) {
              console.log(err);
              if(err.errno === 1062) {
                  /* User already exists */

                  /* Check if account exists */
                  const values = [email, email];
                  const query = 'SELECT id, (SELECT id FROM users WHERE email = ? AND password IS NOT NULL) as userId FROM users WHERE email = ?';
                  con.query(query, values, (err, res) => {
                      if(res) {
                          if(res[0].userId) {
                            /* Account exists */
                            response.send({
                                result: -1
                            });
                          }
                          else {
                              /* It's not an account, but send back already existed data - UPDATE */
                              const userId = res[0].id;
                              const values = [firstName, lastName, city, street, building, flat, postalCode, phoneNumber, email];
                              const query = 'UPDATE users SET first_name = ?, last_name = ?, city = ?, street = ?, building = ?, flat = ?, postal_code = ?, phone_number = ? WHERE email = ?';
                              con.query(query, values, (err, res) => {
                                  got.post("http://hideisland.skylo-test3.pl/newsletter/add", {
                                      json: {
                                          email: email
                                      },
                                      responseType: 'json',
                                  })
                                      .then(res => {
                                          console.log('res');
                                          response.send({
                                              result: 1,
                                              userId
                                          });
                                      });
                                  // response.send({
                                  //     result: 1,
                                  //     userId
                                  // });
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
          }
          else {
              const userId = res.insertId;
              /* Add user to newsletter */
              if(dupa) {
                  got.post("http://hideisland.skylo-test3.pl/newsletter/add", {
                      json: {
                          email: email
                      },
                      responseType: 'json',
                  })
                      .then(res => {
                         response.send({
                             result: 1,
                             userId
                         });
                      });
              }
              else {
                  response.send({
                      result: 1,
                      userId
                  });
              }
          }
       });
    });

   /* REGISTER USER */
   router.post("/register-user", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [email, username, hash];
       const query = 'INSERT INTO users VALUES (NULL, NULL, NULL, ?, ?, ?, NULL, NULL, NULL, NULL, NULL, NULL)'

       con.query(query, values, (err, res) => {
          if(err) {
              /* Error - user not registered */
              let error;
              if(err.errno === 1062) error = 0;
              else error = -1;
              response.send({
                  result: error
              });
          }
          else {
              /* Success - user registered */
              response.send({
                  result: 1
              });
          }
       });

   });

   /* REGISTER ADMIN */
   router.post("/register-admin", (request, response) => {
       const username = request.body.username;
       const email = request.body.email;
       const password = request.body.password;
       const hash = crypto.createHash('md5').update(password).digest('hex');

       const values = [username, hash, email];
       const query = 'INSERT INTO admins VALUES (NULL, ?, ?, ?)';

       con.query(query, values, (err, res) => {
           if(err) {
               /* Error - user not registered */
               let error;
               if(err.errno === 1062) error = 0;
               else error = -1;
               response.send({
                   result: error
               });
           }
           else {
               /* Success - user registered */
               response.send({
                   result: 1
               });
           }
       });
   });

   /* LOGIN USER */
    router.post("/login-user", (request, response) => {
        const username = request.body.username;
        const password = request.body.password;
        const hash = crypto.createHash('md5').update(password).digest('hex');

        const values = [username, hash];
        const query = 'SELECT id FROM users WHERE email = ? AND password = ?';
        let sessionKey;

        con.query(query, values, (err, res) => {
            let result, id = 0;
            if(err) result = -1;
            else {
                if(res.length === 0) result = 0;
                else {
                    result = 1;
                    id = res[0].id;
                    sessionKey = addSessionRow();
                }
            }

            response.send({
                result,
                id,
                sessionKey
            });
        });
    });

    /* LOGIN ADMIN */
    router.post("/login-admin", (request, response) => {
        const username = request.body.username;
        const password = request.body.password;
        const hash = crypto.createHash('md5').update(password).digest('hex');
        let sessionKey;

        const values = [username, hash];
        const query = 'SELECT id FROM admins WHERE username = ? AND password = ?';

        con.query(query, values, (err, res) => {
            let result, id = 0;
            if(err) result = -1;
            else {
                if(res.length === 0) result = 0;
                else {
                    result = 1;
                    id = res[0].id;
                    sessionKey = addSessionRow();
                }
            }

            response.send({
                result,
                id,
                sessionKey,
                username
            });
        });
    });

    /* AUTH USER */
    router.post("/auth", (request, response) => {
        const sessionKey = request.body.sessionKey;

        const values = [sessionKey];
        const query = 'SELECT id, expire_date FROM sessions WHERE session_key = ? ORDER BY id DESC LIMIT 1';

        con.query(query, values, (err, res) => {
            let result;
            if((err)||(!res.length)) result = 0;
            else {
                /* Check if session has expire date */
                const currentDate = new Date();
                const sessionDate = new Date(res[0].expire_date);

                if(currentDate < sessionDate) {
                    /* Update session */
                    updateSession(res[0].id);

                    result = 1;
                }
                else result = 0;
            }

            response.send({
                result
            })
        });
    });

    /* LOGOUT USER */
    router.post("/logout", (request, response) => {
        const sessionKey = request.body.sessionKey;

        const values = [sessionKey];
        const query = 'DELETE FROM sessions WHERE session_key = ?';

        con.query(query, values, (err, res) => {
           response.send({
               result: 1
           });
        });
    });
});

module.exports = router;

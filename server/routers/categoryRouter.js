const express = require("express");
const router = express.Router();
const con = require("../databaseConnection");

con.connect(err => {
    /* ADD CATEGORY */
    router.post("/add", (request, response) => {
        let { name, parentId, permalink, hidden } = request.body;
        hidden = hidden === "hidden";

        if(parentId === "0") parentId = null;

        if(name === "") {
            response.redirect("http://hideisland.skylo-test3.pl/panel/kategorie?added=0");
            return 0;
        }

        const values = [name, parentId, permalink, hidden];
        const query = 'INSERT INTO categories VALUES (NULL, ?, ?, ?, ?)';

        con.query(query, values, (err, res) => {
            console.log(err);
            if(!err) response.redirect("http://hideisland.skylo-test3.pl/panel/kategorie?added=1");
            else response.redirect("http://hideisland.skylo-test3.pl/panel/kategorie?added=-1")
        });
    });

    /* REMOVE CATEGORY */
    router.post("/delete", (request, response) => {
       const { id } = request.body;
       const values = [id];
       const query = 'DELETE FROM categories WHERE id = ?';
       con.query(query, values, (err, res) => {
           let result = 0;
           if(err) {
               result = -1;
               if(err.errno === 1451) result = 0;
           }
           if(res) result = 1;
           response.send({
               result
           });
       });
    });

    /* GET ALL CATEGORIES */
    router.get("/get-all", (request, response) => {
        con.query('SELECT c1.name as parent_name, c2.id, c2.name as name, c2.parent_id, c2.permalink, c2.hidden FROM categories c1 RIGHT OUTER JOIN categories c2 ON c1.id = c2.parent_id', (err, res) => {
           response.send({
               result: res
           });
        });
    });

    /* GET CATEGORY BY NAME */
    router.post("/get-category-by-name", (request, response) => {
       const { name } = request.body;
       const values = [name];
       const query = 'SELECT * FROM categories WHERE name = ?';
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

    /* GET CATEGORY BY SLUG */
    router.post("/get-category-by-slug", (request, response) => {
        const { slug } = request.body;
        const values = [slug];
        const query = 'SELECT * FROM categories WHERE permalink = ?';
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

    /* GET CATEGORY DETAILS */
    router.post("/category-details", (request, response) => {
       const { id } = request.body;
       const query = 'SELECT * FROM categories WHERE id = ?';
       const values = [id];
       con.query(query, values, (err, res) => {
          if(res) {
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

    /* UPDATE CATEGORY */
    router.post("/update", (request, response) => {
    let { id, name, parentId, permalink, hidden } = request.body;
    hidden = hidden === "hidden";
    id = parseInt(id);
    parentId = parseInt(parentId);
    if(!parentId) parentId = null;
    const values = [name, parentId, permalink, hidden, id];
    const query = 'UPDATE categories SET name = ?, parent_id = ?, permalink = ?, hidden = ? WHERE id = ?';

    con.query(query, values, (err, res) => {
        if(!err) response.redirect("http://hideisland.skylo-test3.pl/panel/kategorie?added=2");
        else response.redirect("http://hideisland.skylo-test3.pl/panel/kategorie?added=-1")
    });
    });
});

module.exports = router;

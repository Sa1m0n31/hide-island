const express = require("express");
const router = express.Router();
const multer = require("multer");
const con = require("../databaseConnection");
const path = require("path");

con.connect(err => {
    console.log("connect");

    /* GET */
    router.get("/get-all", (request, response) => {
        const query = 'SELECT * FROM homepage';
        con.query(query, (err, res) => {
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

    /* UPDATE */
    router.post("/update-slider-1", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'slider1', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { link1 } = request.body;

            if(filename) {
                const values = [filename, link1];
                const query = 'UPDATE homepage SET slider_image_1 = ?, slider_link_1 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [link1];
                const query = 'UPDATE homepage SET slider_link_1 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-slider-2", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'slider2', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { link2 } = request.body;

            if(filename) {
                const values = [filename, link2];
                const query = 'UPDATE homepage SET slider_image_2 = ?, slider_link_2 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [link2];
                const query = 'UPDATE homepage SET slider_link_2 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-slider-3", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'slider3', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { link3 } = request.body;

            if(filename) {
                const values = [filename, link3];
                const query = 'UPDATE homepage SET slider_image_3 = ?, slider_link_3 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [link3];
                const query = 'UPDATE homepage SET slider_link_3 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-section-1", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'section1', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { section1Link } = request.body;

            if(filename) {
                const values = [filename, section1Link];
                const query = 'UPDATE homepage SET section_image_1 = ?, section_link_1 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [section1Link];
                const query = 'UPDATE homepage SET section_link_1 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-section-2", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'section2', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { section2Link } = request.body;

            if(filename) {
                const values = [filename, section2Link];
                const query = 'UPDATE homepage SET section_image_2 = ?, section_link_2 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [section2Link];
                const query = 'UPDATE homepage SET section_link_2 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-section-3", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'section3', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { section3Link } = request.body;

            if(filename) {
                const values = [filename, section3Link];
                const query = 'UPDATE homepage SET section_image_3 = ?, section_link_3 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [section3Link];
                const query = 'UPDATE homepage SET section_link_3 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-section-4", (request, response) => {
        let filename;

        const storage = multer.diskStorage({
            destination: "media/homepage/",
            filename: function(req, file, cb) {
                const fName = file.fieldname + Date.now() + path.extname(file.originalname);
                filename = fName;
                cb(null, fName);
            }
        });

        const upload = multer({
            storage: storage
        }).fields([{name: 'section4', maxCount: 10}]);

        upload(request, response, (err, res) => {
            if (err) throw err;

            const { section4Link } = request.body;

            if(filename) {
                const values = [filename, section4Link];
                const query = 'UPDATE homepage SET section_image_4 = ?, section_link_4 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
            else {
                const values = [section4Link];
                const query = 'UPDATE homepage SET section_link_4 = ?';
                con.query(query, values, (err, res) => {
                    if(res) {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
                    }
                    else {
                        response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
                    }
                });
            }
        });
    });

    router.post("/update-header", (request, response) => {
       const { header } = request.body;

       const values = [header];
       const query = 'UPDATE homepage SET section_header = ?' ;
       con.query(query, values, (err, res) => {
           if(res) {
               response.redirect("https://hideisland.pl/panel/zdjecia?add=1");
           }
           else {
               response.redirect("https://hideisland.pl/panel/zdjecia?add=0");
           }
       });
    });
});

module.exports = router;

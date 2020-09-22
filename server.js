// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});
//แสดงทั้งหมด
app.get("/api/product", (req, res, next) => {
    var sql = "select * from product"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});
//แสดงตาม id
app.get("/api/product/:id", (req, res, next) => {
    var sql = "select * from product where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

//สร้างสินค้า
app.post("/api/product/", (req, res, next) => {

    var data = {
        name: req.body.name,
        category: req.body.category,

    }
    var sql = 'INSERT INTO product (name,category ) VALUES (?,?)'
    var params = [data.name, data.category,]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
})

//อัพเดตสินค้า
app.patch("/api/product/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        category: req.body.category,
    }
    console.log('req.params.id', req.params.id);
    db.run(
        `UPDATE product 
            SET name = ?, category = ?
            WHERE id = ?`,
        [data.name, data.category, req.params.id],
        function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
            console.log("data", data)
        });

})
//ลบ
app.delete("/api/product/:id", (req, res, next) => {
    db.run(
        'DELETE FROM product WHERE id = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
})

// Insert here other API endpoints

// Default response for any other request
app.use(function (req, res) {
    res.status(404);
});
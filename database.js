var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE product (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            category text
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO product (name, category) VALUES (?,?)'
                    db.run(insert, ["Nike", "shoes"])
                    db.run(insert, ["Adidass", "shoes"])
                }
            });
    }
});


module.exports = db
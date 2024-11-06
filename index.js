let express = require("express");

let mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

let app = express();

//Database Connection

let conn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

conn.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Initial Post to create a table
app.post("/", (req, res) => {
  conn.query(
    `CREATE TABLE list(
        id INT AUTO_INCREMENT PRIMARY KEY,
        work VARCHAR(100)
        );`,
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
  res.send("Hello User");
});

//To Post data to table API

app.post("/post", (req, res) => {
  conn.query(`insert into list set ?`, req.body, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//To get data from Table API
app.get("/get", (req, res) => {
  conn.query(`select * from list`, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

//To delete Data from Table API
app.delete("/delete/:id", (req, res) => {
  id = req.params.id;

  conn.query(`DELETE FROM list where id=${id}`, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(req.params.id);
    }
  });
});

//To Update or Edit data in Table API
app.patch("/patch/:id", (req, res) => {
  id = req.params.id;
  data = req.body.work;

  // conn.query(`UPDATE list SET work=${JSON.stringify(data)} WHERE id=${id}`,(err,result)=>{
  conn.query(`UPDATE list SET work=? WHERE id=?`, [data, id], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(process.env.port, () => {
  console.log("Started server 3015");
});

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const port = 5000;

const app = express();

//middlewares

app.use (cors());
app.use(express.json());

//making connection with mysql server

let db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'postbook',
});
 
db.connect((err) =>{
    if (err){
      console.log("Error Connecting to the database: ", err);
      throw err;
        
    }
    else{
        console.log("MySQL server connected...");
    }
});

//getting user data from server
app.post("/getUserInfo", (req, res) => {
  console.log(req.body);
  const { userId, password } = req.body;

  const getUserInfoSql = `SELECT userId, userName, userImage FROM users WHERE users.userId = ? AND users.userPassword = ?`;
  let query = db.query(getUserInfoSql, [userId, password], (err, result) => {
    if (err) {
      console.log("Error getting user info from the database: ", err);
      throw err;
    }

    // console.log(result);
    res.send(result);
  });
});

app.get("/getAllPosts", (req, res) => {
  let sqlForAllPosts =
    `SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postedTime, posts.postedText, posts.postImageUrl FROM posts INNER JOIN users ON posts.postedUserId = users.userId ORDER BY posts.postedTime DESC`; 
  let query = db.query(sqlForAllPosts, (err, result) => {
    if (err) {
      console.log("Error loading all post from database: ", err);
      throw err;
    }

    //sending data to front end
    console.log(result);
    res.send(result);
  });
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
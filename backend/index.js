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
    `SELECT users.userName AS postedUserName, users.userImage AS postedUserImage, posts.postedTime, posts.postedText, posts.postId, posts.postImageUrl FROM posts INNER JOIN users ON posts.postedUserId = users.userId ORDER BY posts.postedTime DESC`; 
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

//getting comment of a single post

app.get("/getAllComments/:postId", (req, res) => {
  let id = req.params.postId;

  let sqlForAllComments = `SELECT users.userName AS commentedUserName, users.userImage AS commentedUserImage, comments.commentId, comments.commentTime, comments.commentOfPostId, comments.commentText FROM comments INNER JOIN users ON comments.commentedUserId = users.userId WHERE comments.commentOfPostId = ${id}`;

  let query = db.query(sqlForAllComments, (err, result) => {
    if (err) {
      console.log("Error fetching comments from the database: ", err);
      throw err;
    }else{
      res.send(result);
    }
  });
});

// adding new comment to a post
app.post("/postComment", (req, res) => {
  const { commentOfPostId, commentedUserId, commentText, commentTime } =
    req.body;

  let sqlForAddingNewComments = `INSERT INTO comments (commentId, commentOfPostId, commentedUserId, commentText, commentTime)
   VALUES (NULL, ?, ?, ?, ?)`;

  let query = db.query(sqlForAddingNewComments,
    [commentOfPostId, commentedUserId, commentText, commentTime ],
    (err, result) => {
      if (err) {
        console.log("Error adding comment to the database: ", err);
      } else{
      res.send(result);
    }
  }
  );
});


app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
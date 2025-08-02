const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const port = 5000;

const app = express();
//middlewares

app.use (cors());
app.use(express.json());

app.get ("/example",(req,res) => {
    res.send ("hello world");

});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

const express = require("express");
const cors = require("cors");
const db = require("./database");


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GameVault API is running!");
});


app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "GameVault backend is working!"
  });
});


app.listen(PORT, () => {
  console.log(`GameVault server running on http://localhost:${PORT}`);
});
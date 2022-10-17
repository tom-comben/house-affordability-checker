import express from "express";
import { port } from "../config/server.js";
import getPriceData from "./getPriceData";

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");

app.post("/api", (req, res) => {
  getPriceData(req.body).then((priceData) => {
    res.json(priceData);
  });
});

app.get("*", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.info(`Running on port ${port}...`);
});

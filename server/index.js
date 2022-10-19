import express from "express";
import { port } from "../config/server.js";
import getPriceData from "./getPriceData";

const app = express();

const errorHandler = (err, req, res, next) => {
  console.log(`error: ${err}`);
  res.header("Content-Type", "application/json");
  const status = err.status || 400;
  res.status(status).send(err);
};

app.use(express.static("public"));
app.use(express.json());

app.set("view engine", "ejs");

app.post("/api", errorHandler, (req, res, next) => {
  getPriceData(req.body)
    .then((priceData) => {
      return res.json(priceData);
    })
    .catch((err) => {
      next(err);
    });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Running on port ${port}...`);
});

import express from "express";
import { port } from "./config.js";

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { answer: "XXXXX" });
});

app.listen(port, () => {
  console.info(`Running on port ${port}...`);
});

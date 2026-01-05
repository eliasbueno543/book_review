import express from "express";
import cors from "cors";
import makeQuery from "./database.ts";

const app = express();
app.use(cors());

const PORT = 3000;

app.get("/test", async (req, res) => {
  makeQuery();
  return res.send("yay");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server iniciado em localhost/${PORT}`);
  }
});

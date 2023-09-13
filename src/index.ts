import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

const myport = process.env.PORT ? parseInt(process.env.PORT as string) : 3030;

app.get("/hello", async (_, res) => {        
    res.send("Hello");   
});

app.listen( myport, () =>
  console.log(`Server is listening on port ${myport}`)
);
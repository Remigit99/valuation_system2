import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";



export const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());


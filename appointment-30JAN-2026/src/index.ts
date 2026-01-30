 import express from "express";
import { Server } from "../server/Server";
import { Service, Signin, Signup } from "../controller/Controllers";
 export const app=express();
 const router=express.Router();
app.use(express.json());


app.use("/auth",router);
router.post("/register",Signup);
router.post("/login",Signin);

app.use("/services",router);
router.post("/",Service);

 await Server();
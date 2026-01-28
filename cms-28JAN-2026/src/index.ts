import express from "express";
import * as Controller from "./controllers/Controller";
import { AuthMiddleware } from "./Middlewares/Authmiddleware";
import { AdminCheck } from "./Middlewares/AdminCheck";

const app = express();
const router = express.Router();
app.use(express.json());
app.use(router);
router.post("/course", AuthMiddleware, AdminCheck("ADMIN"), Controller.course);
router.get("/courses",Controller.getCourse);
app.use("/auth", router);
router.post("/signup", Controller.signup);
router.post("/signin", Controller.signin);

app.listen(3020, () => {
  console.log("Server running on 3020");
});

import express from "express";
import * as Controller from "./controllers/Controller";
import { AuthMiddleware } from "./Middlewares/Authmiddleware";
import { AdminCheck } from "./Middlewares/AdminCheck";

const app = express();
const router = express.Router();
app.use(express.json());
app.use("/auth", router);
router.post("/signup", Controller.signup);
router.post("/signin", Controller.signin);
app.use("/courses", router);
router.post("", AuthMiddleware, AdminCheck("ADMIN"), Controller.course);
router.get("", Controller.getCourse);
router.post(
  "/:courseId/lectures",
  AuthMiddleware,
  AdminCheck("ADMIN"),
  Controller.lesson,
);
router.get("/:courseId/lectures", AuthMiddleware, Controller.getLesson);
router.post("/:courseId/purchase", AuthMiddleware, Controller.Purchase);
app.use("/me", router);
router.get("/courses", AuthMiddleware, Controller.getEnroll);
router.get("/subscriptions", AuthMiddleware, Controller.getSubscriptions);

app.listen(3020, () => {
  console.log("Server running on 3020");
});

import { Router } from "express";
import authenticateUser from "../middleware/authenticate";
import { allMessage, sendMessage } from "../controllers/message.js";
const router = Router();

router.get("/:chatId", authenticateUser, allMessage);
router.post("/").post(authenticateUser, sendMessage);

export default router;

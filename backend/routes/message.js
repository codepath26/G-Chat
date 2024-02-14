import { Router } from "express";
import authenticateUser from "../middleware/authenticate.js";
import { allMessage, sendMessage } from "../controllers/message.js";
const router = Router();

router.get("/:chatId", authenticateUser, allMessage);
router.post("/", authenticateUser, sendMessage);

export default router;

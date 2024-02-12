import { Router } from "express";
import authenticateUser from "../middleware/authenticate.js";
import {
  accessChat,
  addToGroup,
  createGroupChat,
  fetchChats,
  removerFromGroup,
  renameGroup,
} from "../controllers/chat.js";

const router = Router();
// router.post('/',authenticateUser , postchat)
router.get("/:id", authenticateUser, accessChat);
router.route("/").get(authenticateUser, fetchChats);
router.route("/group").post(authenticateUser, createGroupChat);
router.route("/rename").put(authenticateUser, renameGroup);
router.route("/groupremove").put(authenticateUser, removerFromGroup);
router.route("/groupadd").put(authenticateUser, addToGroup);

export default router;

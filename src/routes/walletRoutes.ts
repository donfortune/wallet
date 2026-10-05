import { Router, Request, Response } from "express";

const { getWallet } = require("../controller/walletController");

const router = Router();

router.get("/:walletId", getWallet);

export = router;
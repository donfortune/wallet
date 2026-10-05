import { Router } from "express";

const { handleProviderEvent } = require("../controller/providerEventController");

const router = Router();

router.post("/events", handleProviderEvent);

export = router;
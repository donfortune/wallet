import { Request, Response } from "express";

const providerEventService = require("../services/providerEventService");

exports.handleProviderEvent = (req: Request, res: Response) => {
    try {
        const result = providerEventService.processProviderEvent(req.body);

        return res.status(200).json(result);

    } catch (error: any) {
        console.error("Error processing provider event:", error);

        return res.status(400).json({
            error: error.message,
        });
    }
};
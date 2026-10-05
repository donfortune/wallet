import { Request, Response } from "express";

const walletService = require("../services/walletService");

exports.getWallet = (req: Request, res: Response) => {
    try {
        const wallet = walletService.getWallet(req.params.walletId);

        if (!wallet) {
            return res.status(404).json({
                error: "Wallet not found",
            });
        }

        return res.status(200).json(wallet);

    } catch (error) {
        console.error("Error fetching wallet:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
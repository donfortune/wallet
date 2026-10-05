import app = require("./app");
import "./db";
import env = require("dotenv");
import walletRoutes = require("./routes/walletRoutes");
import providerEventRoutes = require("./routes/providerEventRoutes");

env.config();

app.use("/wallets", walletRoutes);
app.use("/provider", providerEventRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Wallet API running on http://localhost:${PORT}`);
});


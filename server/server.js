import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import connectDB from "./config/db.js";

import app from "./app.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {

    console.log(`Server Running On Port ${PORT}`);

});
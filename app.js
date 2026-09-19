import express from "express";
import sequelize from "./config/database.js";
import router from "./routes/index.js";


const app = express();

app.use(express.json());


app.use("/api",router);



async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully");

        await sequelize.sync({ alter: true });
        console.log("Users table created");

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    } catch (error) {
        console.error("Unable to connect:", error);
    }
}

startServer();

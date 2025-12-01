import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5000;

if (process.env.NODE_APP_ENV === "development") {
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
}

export default app;

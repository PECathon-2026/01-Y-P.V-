
import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
    res.json({
        success: true,
        message: "Small Web Reader backend is running!",
    });
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});

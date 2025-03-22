import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const { Client } = pg;
const db = new Client({
    user: "postgres",
    host: "localhost",
    password: "Ejc9c123",
    port: 5432,
    database: "postgres"
});

db.connect();

const corsOptions = {
    origin: ["http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());

// Get all notes
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM notes");
        res.json(result.rows);
        console.log(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


app.post("/", async (req, res) => {
    const { title, content, id } = req.body;
    try {
        await db.query(
            "INSERT INTO notes (id, title, content) VALUES ($1, $2, $3)",
            [id, title, content]
        );
        res.status(201).send("Data received successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Delete a note
app.post("/delete", async (req, res) => {
    const { id } = req.body;
    try {
        const result = await db.query("DELETE FROM notes WHERE id = $1", [id]);
        if (result.rowCount === 0) {
            return res.status(404).send("Note not found");
        }
        res.send("Data received successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
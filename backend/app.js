import express from "express";
import cors from "cors";
import pg from "pg";

const app = express();
const { Client } = pg;
const config = {
    user: "avnadmin",
    password: "AVNS_4WiDcqPUw8y4ZHSsiB-",
    host: "pg-cc4347f-keeper-app.j.aivencloud.com",
    port: 17894,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIETTCCArWgAwIBAgIUQwjNxRJvACQ2eFdOVYZsXt2Zai8wDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1MTMzYTMyOWUtZDMxYS00MjkyLWI3NjEtN2NlZTc4NWNj
ZWRlIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwMzIyMjA1NDAxWhcNMzUwMzIwMjA1
NDAxWjBAMT4wPAYDVQQDDDUxMzNhMzI5ZS1kMzFhLTQyOTItYjc2MS03Y2VlNzg1
Y2NlZGUgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBALVOyOwAPEnSlmXz4OoRRWrnClrDSBstiqddWFckbZRIbhUnsMhMRxeJ
XBU5tHCtmxrGWK01I2rJNxWxY7Wc/NrBKkwZDTlBYWpx6eGnODp+MDHKm6awAiN6
2vaWgEefHkmZHN10oHP0BZi956cbcc8Gh5spJ/nN2gV1VXcn+5aY7Rz0p1He59Np
Avm+ldPwXAAywtc9eraSYV5hjayAkFP5Ph8XvWM+IQ5vYRGnydhTyYzX7Wbtbdly
nrqW7jWWtZ/xm9UnQ3sJVZ5LOV62x5UXN67fJ53yvuBRmPCM1fCnuvxPCVuNwzUO
Ze6xOpo449gf4l+0Ct5+SqEMsrQR83JTzx8eeKzTImv7Y6Q2LjdJ7qpeZhrfW7Qv
yNI0KaKcRh+Deu7xvus093A9enaMrfjENbIVALsSf0qc7IweXbGDVberOkKl6Ymc
BDkQEkRxhtLf3nucFNUNINp27d4IecY/lB3AzCP59MXf8E6szyfwi2wZ6uxd8l23
BYpHgRB5CQIDAQABoz8wPTAdBgNVHQ4EFgQUKjuvfYfaLYrZdX1ZYmr0j+9mZhww
DwYDVR0TBAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGB
AB3eDOA6/g5wt5YDgofyE10CRvEXkqxJ8gSAC5S8Gle0wB7878kQjE5XsKAqQcTl
+4VUNWudMyAImqLShQda7E1sAE/3Re4fOWXSozN142WHvr5JZEODmlZfNMJkrQY3
StTvfXf86SZSIXCucqY8TVYaPvx3Ga/jqiN1/7FujSMup/GjazgroQ18N4se+OG3
+h6czn5RTTG6/+3gQABB65F1/0TJlMtKcsH+an3/lBVDj5xJqjHHFUq474jvLNba
S4GKmW4SbQNnclyEF6KF2WWD7M6t0jdZ1pfPXdhHGSsO5PqsdTY3Cf5nVGt1a79H
64d4px3VNRN282pz15ahURgJzcGMkanXhdMAO5jKEHLCGGkBqGxGHAZYNzxWSmFB
T9PJ61gdZvC2EMo5NIK7HZ8K9JQH5sB3VcqHdMPbvx6yoMabhuLQvyITXB6qKxlr
IIXhxI0Ji+BqQEl+qvCRgfikCL0u4mhr62j4YMNkBHwqWdAbJa4cEnxiVytYSMwP
QA==
-----END CERTIFICATE-----`,
    },
};

const db = new Client(config);




db.connect();

const corsOptions = {
    origin: [
        "http://localhost:5173", // Local development
        "https://keeper-frontend-h2mpbabpm-mshraky3s-projects.vercel.app" // Production frontend
    ],
    methods: ["GET", "POST", "DELETE"]
};

app.use(cors(corsOptions));
app.use(express.json());


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

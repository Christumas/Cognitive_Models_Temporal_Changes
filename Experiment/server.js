import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import cors from "cors";

const corsConfig = {
    origin : ["http://localhost:5000", "http://localhost:9000/"],
    methods:["GET","POST"],
    allowedHeaders: ["Content-Type"]
}
const app = express();
const port = 5000;
app.use(cors(corsConfig))
app.use(express.json());
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "4treeLilycov3##!",
  database: "Participants",
  port: 5432,
});

db.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.get("/check", async (req, res) => {
  try {
    const prolificID = req.query.PROLIFIC_PID;

    let result = await db.query(
      "SELECT * FROM participantIDs WHERE ppID = $1",
      [prolificID]
    );

    //if the ID exists, that means the participant did session 1, we need to serve the file name for session 2
    //and also update the date it was served to the table
    if (result.rows.length > 0) {
      let file = result.rows[0].session_2;
      let date = new Date().toISOString();
      console.log(file);

      //record the date for when the second designfile is served in the database
      await db.query(
        "UPDATE participantIDs SET date_assigned_s2 = $1 WHERE ppID=$2",
        [date, prolificID]
      );
      res.json({ file: file, exists: true });
    } else {
      res.json({ file: null, exists: false });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

app.post("/participants", async (req, res) => {
  try {
    const prolificID = req.body.prolificID;
    const firstSessionFile = req.body.firstSession; //first session design file
    const dateFirst = req.body.dateFirstSession;
    const secondSessionFile = req.body.secondSession; //second session design file
    const dateSecond = req.body.dateSecondSession;

    await db.query(
      "INSERT INTO participantIDs (ppID, session_1, date_assigned_s1, session_2, date_assigned_s2 )VALUES ($1,$2,$3,$4,$5)",
      [prolificID, firstSessionFile, dateFirst, secondSessionFile, dateSecond]
    );
    res.status(201).json({
      success: true,
      message: "Participant data has been added and saved.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});

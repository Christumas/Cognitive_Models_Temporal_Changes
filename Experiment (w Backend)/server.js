import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import cors from "cors";

const corsConfig = {
    origin : ["http://localhost:5000", "http://localhost:9000"],
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

//app.use(express.static(path.join(__dirname, "public")));

app.get("/check", async (req, res) => {
  try {
    const prolificID = req.query.PROLIFIC_PID;

    let result = await db.query(
      "SELECT * FROM participantIDs WHERE ppID = $1",
      [prolificID]
    );

    //if the ID exists, that means the participant has visited the study link. However we need to ensure that session 1 was completed
    //before serving the session 2 design file
    if (result.rows.length > 0) {
      const participant = result.rows[0]
      //check if session 1 was complete => if not then serve session 1 file again (this ensures refreshes of the page doesnt start session 2)
      if (!participant.session_1_complete){
        res.json({
          exists:true,
          file: participant.session_1,
          session: 1
        });
        return;
      }


      //if session 1 is complete, session 2 is not complete => we serve session 2 file
      if(participant.session_1_complete && !participant.session_2_complete){
        const date = new Date().toISOString();
         //record the date for when the second designfile is served in the database
        await db.query(
        "UPDATE participantIDs SET date_assigned_s2 = $1 WHERE ppID=$2",
        [date, prolificID]
        );
        res.json({
          exists:true,
          file:participant.session_2,
          session:2
        });
        return;

      }
     
    } else {
      //PPID doesnt exist, therefore a random assignment should happen on the frontend after sending the response
      res.json({ file: null, exists: false, sesion: null });
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


app.post("/complete", async(req,res) => {
  try{
    const {prolificID, sessionNumber} = req.body;

    if(sessionNumber ===1){
      await db.query(
        "UPDATE participantids SET session_1_complete = TRUE WHERE ppID = $1", [prolificID]
      )
    } else if(sessionNumber === 2){
      await db.query(
        "UPDATE participantids SET session_2_complete = TRUE WHERE ppID = $2", [prolificID]
      )
    }
    res.status(200).json({success:true, message: `${sessionNumber} was marked complete.`})

  }

  catch (error){
    res.status(500).json({success:false, message: error.message})
  }
})

app.listen(port, () => {
  console.log(`Listening at Port ${port}`);
});

const jsPsych = initJsPsych({
  override_safe_mode: true,
  on_finish: function () {
    //jsPsych.data.get().localSave("csv","sampleData.csv")
  },
});
const timeline = [];
const designFileFolder = "./DesignFiles";
const designFileList = "./DesignFiles/DesignFileList.json";
let isDayTwo = false;

//STEPS
//1. Create an async function which will get the design file from the design file folder for the participant.
//2. Create an async function runExperiment() which will handle the experiment flow and have the timeline ready
//   for the participant
//a. Create a designFile variable, run the async function to grab the design file and store it.
//b. Create an experiment object with jsPsych instance and the designFile
//a. Run the method to load the design file and populate the blockAndTrials object
//b. Run a loop to populate the timeline with all the trials and a block performance evaluation screen.

async function getProlificID() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("PROLIFIC_PID")) {
    return params.get("PROLIFIC_PID");
  }
}

async function getDesignFile(designFileList) {
  try {
    let chosenDesignFile;
    let prolificID = "test_02";
    //Logic:
    //send get request to the backend to see if the prolific ID exists, if it already exists,
    //it means the participant already did the first_session
    let baseAPIURL = `http://localhost:5000`;
    let response = await fetch(baseAPIURL + `/check?PROLIFIC_PID=${prolificID}`); //check api to see if the prolific id already exists
    if(!response.ok){
        throw new Error("Error executing check API call")
    }
    let data = await response.json(); //parse the response to json

    if (!data.exists) {
      console.log("Session 1 is running");
      //---SESSION 1----//
      //participant prolific ID doesnt exist in the database, that means they are doing it for the first time,
      //therefore randomly assign a design file
      //THIS WILL BE FOR SESSION 1
      let response = await fetch(designFileList);
      let designFiles = await response.json();
      let firstSessionFiles = designFiles.filter((file) =>
        file.endsWith("session1.csv")
      );

      let fileIndex = Math.floor(Math.random() * firstSessionFiles.length);
      let fileName = firstSessionFiles[fileIndex];

      //this goes in the POST request back to the database to be stored
      chosenDesignFile = designFileFolder + "/" + fileName; //this will be the path to the file assigned to the participant
      let dateFirstSession = new Date().toISOString();
      let secondSessionFile = chosenDesignFile.replace("session1", "session2");
      const newParticipant = {
        prolificID: prolificID,
        firstSession: chosenDesignFile,
        dateFirstSession: dateFirstSession,
        secondSession: secondSessionFile,
        dateSecondSession: null,
      };

      //send the information to the backend to be stored in the database with a POST request
      let sendRequest = await fetch(baseAPIURL + `/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newParticipant),
      });
      console.log(sendRequest);

      if (!sendRequest.ok) throw new Error("Error, could not save participant");

      return chosenDesignFile;
    } else {
      //-----SESSION 2-----//
      //participant ID exists, therefore they need to be served the second design file returned by the API
      //request
      console.log("Session 2 is running");
      isDayTwo = true;
      let chosenDesignFile = data.file;
      console.log(chosenDesignFile)

      return chosenDesignFile;
    }
  } catch (error) {
    console.error("Couldn't grab file", error.message);
  }
}

async function runExperiment() {
  const designFile = await getDesignFile(designFileList);

  //create experiment object
  const mainExperiment = new Experiment(jsPsych, designFile);
  //load the design file into the object so you can generate trials
  await mainExperiment.loadDesignFile(designFile);
  //generate the trials for each block
  await mainExperiment.generateTrials();

  //generate the trials for the sorting block (this will only be triggered )
  await mainExperiment.createSortingBlock();
  const sortingTrials = mainExperiment.sortingTrials;

  //store them in a variable
  const experimentBlockTrials = mainExperiment.blockAndTrials;

  console.log(experimentBlockTrials);

  for (let block in experimentBlockTrials) {
    const trials = experimentBlockTrials[block];
    timeline.push(...trials);
    const performanceScreen = mainExperiment.generatePerformanceSummary(block);
    timeline.push(performanceScreen);
  }

  if (isDayTwo) {
    timeline.push(sortingTrials);
  }

  jsPsych.run(timeline);
}

runExperiment();

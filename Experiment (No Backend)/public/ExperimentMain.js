jatos.onLoad(function () {
  const jsPsych = initJsPsych({
    override_safe_mode: true,
    on_finish: async function () {
      //jsPsych.data.get().localSave("csv","sampleData.csv")
    },
  });
  const timeline = [];
  const designFileFolder = "./DesignFiles";
  const designFileList = "./DesignFiles/DesignFileList.json";
  let PROLIFICPID = null;
  let isDayTwo = false;

  //STEPS
  //1. Create an async function which will get the design file from the design file folder for the participant.
  //2. Create an async function runExperiment() which will handle the experiment flow and have the timeline ready
  //   for the participant
  //a. Create a designFile variable, run the async function to grab the design file and store it.
  //b. Create an experiment object with jsPsych instance and the designFile
  //a. Run the method to load the design file and populate the blockAndTrials object
  //b. Run a loop to populate the timeline with all the trials and a block performance evaluation screen.

  async function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("PROLIFIC_PID") && params.has("SESSION_ID")) {
      return [params.get("PROLIFIC_PID"), params.get("SESSION_ID")];
    } else {
      return [jatos.urlQueryParameters.PROLIFIC_PID, jatos.urlQueryParameters.SESSION_ID];
    }
  }

  //function to get a deterministic number which we will use as the index 
  function hashString(str){
    let hash = 0;
    for(let i=0; i<str.length; i++){
      hash = (hash <<5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash)
  }

  async function getDesignFile(designFileList) {
    try {
      let chosenDesignFile
      let [prolificID,sessionID] = await getURLParams();
      PROLIFICPID = prolificID;
    
      //get list of design files
      let response = await fetch(designFileList);
      let designFiles = await response.json();

      //hash the prolific id so we get a deterministic number which we will use as the index and grab a design file from the designFiles
      //array
      let designIndex = (hashString(prolificID) % designFiles.length) + 1;
      console.log(designIndex);

      //get the first session file using the designfile index and then find the corresponding second session file
      let firstSessionFiles = designFiles.filter((file) =>
        file.endsWith("session1.csv")
      );
      let firstSessionFile = firstSessionFiles[designIndex];
      let secondSessionFile = firstSessionFile.replace("session1", "session2");

      if(sessionID ===1){
        chosenDesignFile = designFileFolder + "/" + firstSessionFile;
        console.log(`First session running, returned file ${firstSessionFile}`);
        return chosenDesignFile;
      } else{
        chosenDesignFile = designFileFolder + "/" + secondSessionFile;
        console.log(`Second session running, returned file ${secondSessionFile}`);
        isDayTwo = true;
        return chosenDesignFile;
      }
        
    } catch (error) {
      console.error("Couldn't grab file", error.message);
    }
  }

  

  //---Experiment flow---//

  async function runExperiment() {
    //grab design file
    const designFile = await getDesignFile(designFileList);

    //create experiment object
    const mainExperiment = new Experiment(jsPsych, designFile);
    //load the design file into the object so you can generate trials
    await mainExperiment.loadDesignFile(designFile);
    //generate the trials for each block
    await mainExperiment.generateTrials();
    //store the trials in a variable
    const experimentBlockTrials = mainExperiment.blockAndTrials;

    //generate the trials for the sorting block (this will only be triggered for session 2 )
    await mainExperiment.createSortingBlock();
    const sortingTrials = mainExperiment.sortingTrials;

    console.log(experimentBlockTrials);

    //add the welcome screen
    // timeline.push(welcomeScreen);
    // timeline.push(ConsentForm);
    // timeline.push(instructionsScreen);

    //add the trials to the timeline
    for (let block in experimentBlockTrials) {
      const trials = experimentBlockTrials[block];
      timeline.push(...trials);
      const performanceScreen =
        mainExperiment.generatePerformanceSummary(block);
      timeline.push(performanceScreen);
      if (block < 8) {
        timeline.push(postBlockScreen);
      }
    }

    //sorting block is only added if it is the second session
    if (isDayTwo) {
      timeline.push(secondBlockScreen);
      console.log("sorting trials loaded");
      timeline.push(sortingTrials);
      console.log("end screen added");
      timeline.push(endScreen);
    } else {
      timeline.push(endScreen);
    }

    jsPsych.data.addProperties({
      design_file: designFile,
    }); //manually adding the designfile name to our final results
    jsPsych.run(timeline);
  }

  runExperiment();

  //-------------Code to generate the consent, welcome, instruction and post block screens------//
  const welcomePrompt = `<p style="font-size:1.5rem;">Welcome to our experiment!</p>`;
  const welcomeScreen = new Screen(jsPsych, welcomePrompt, [" "]);

  const instructionsPrompt = `
<div style="padding:2rem; font-size:1.2rem;">
<p>In this game you will be presented with abstract objects presented in series.
Once in a while, you will be shown two abstract objects and you are required to pick the object, which you think
is the next object.</p>
<p >You will play a total of 8 blocks of this game! Press SPACE to proceed</p>
<p>Good luck!</p>
</div>`;
  const instructionsScreen = new Screen(jsPsych, instructionsPrompt, [" "]);

  let check_consent = function () {
    const items = document.querySelectorAll(".consent-item");
    const allChecked = Array.from(items).every((item) => item.checked); //returns a boolean if all the items are ticked or not

    if (!allChecked) {
      alert("Please make sure you checked all the boxes before proceeding");
      return false;
    }

    return true;
  };

  const ConsentForm = {
    type: jsPsychExternalHtml,
    url: "consent/consent_form.html",
    cont_btn: "Continue",
    check_fn: check_consent,
    execute_script: true, //for when your callback function check_consent returns true
  };

  const postBlockPrompt = `
    <div>
    <p>The next block will begin. Press SPACE to proceed.</p>
    </div>
`;
  const postBlockScreen = new Screen(jsPsych, postBlockPrompt, [" "]);

  const secondBlockPrompt = `
    <div>
    <p>You will now do one final block where you sort the different features of the objects, based off
    the order in which they appeared.</p>
    <p>Press SPACE to continue.</p>
    </div>`;
  const secondBlockScreen = new Screen(jsPsych, secondBlockPrompt, [" "]);

  const endScreenPrompt = `
    <div>
    <p>You've have completed the game!</p>
    <p>Thank you for playing! </p>
    <p>Press SPACE to exit the game!</p>
    </div>`;
  const endScreenCallback = () => {
          const experimentData =jsPsych.data.get().csv();
          jatos.appendResultData(experimentData);
          console.log("Jatos appended data")
          jatos.endStudy()
          console.log("Jatos ended study");
  }
  const endScreen = new Screen(jsPsych, endScreenPrompt, [" "], null, endScreenCallback);
});

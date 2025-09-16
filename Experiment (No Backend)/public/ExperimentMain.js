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
  let currentSession = null;
  let chosenDesignFileName = null;
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
      return [
        jatos.urlQueryParameters.PROLIFIC_PID,
        jatos.urlQueryParameters.SESSION_ID,
      ];
    }
  }

  //function to get a deterministic number which we will use as the index
  async function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }

    return Math.abs(hash);
  }

  async function getDesignFile(designFileList) {
    try {
      let chosenDesignFile;
      let [prolificID, sessionID] = await getURLParams();
      console.log("Prolific ID", prolificID, "SessionID ", typeof sessionID);
      PROLIFICPID = prolificID;

      //get list of design files
      let response = await fetch(designFileList);
      let designFiles = await response.json();

      //hash the prolific id so we get a deterministic number which we will use as the index and grab a design file from the designFiles
      //array
      let idNumber = await hashString(prolificID);
      

      //get the first session file using the designfile index and then find the corresponding second session file
      let firstSessionFiles = designFiles.filter((file) =>
        file.endsWith("session1.csv")
      );
      let designIndex = (idNumber % firstSessionFiles.length);
      let firstSessionFile = firstSessionFiles[designIndex];
      let secondSessionFile = firstSessionFile.replace("session1", "session2");

      if (Number(sessionID) === 1) {
        chosenDesignFileName = firstSessionFile;
        chosenDesignFile = designFileFolder + "/" + firstSessionFile;
        currentSession = 1;
        console.log(`First session running, returned file ${firstSessionFile}`);
        return chosenDesignFile;
      } else {
        chosenDesignFile = secondSessionFile;
        chosenDesignFile = designFileFolder + "/" + secondSessionFile;
        currentSession = 2;
        console.log(
          `Second session running, returned file ${secondSessionFile}`
        );
        isDayTwo = true;
        return chosenDesignFile;
      }
    } catch (error) {
      console.error("Couldn't grab file", error.message);
    }
  }

  //---EXPERIMENT FLOW---//

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
    timeline.push(welcomeScreen.getScreen());
    timeline.push(welcomeScreen.goFullScreen())
    timeline.push(ConsentForm);
    timeline.push(instructionsScreen.getScreen());

    //add the trials to the timeline
    for (let block in experimentBlockTrials) {
      const trials = experimentBlockTrials[block];
      timeline.push(...trials);
      const performanceScreen =
        mainExperiment.generatePerformanceSummary(block);
      timeline.push(performanceScreen);
      if (block < 8) {
        timeline.push(postBlockScreen.getScreen());
      }
    }

    //sorting block is only added if it is the second session
    if (isDayTwo) {
      timeline.push(secondBlockScreen.getScreen());
      console.log("sorting trials loaded");
      timeline.push(sortingTrials);
      console.log("end screen added");
      timeline.push(endScreen.getScreen());
    } else {
      timeline.push(endScreen.getScreen());
    }

    jsPsych.data.addProperties({
      design_file: chosenDesignFileName,
      session: currentSession,
    }); //manually adding the designfile name to our final results
    jsPsych.run(timeline);
  }

  runExperiment();

  //-------------Code to generate the consent, welcome, instruction and post block screens------//
  const welcomePrompt = `<div class="screen-prompt">
  <p>Welcome to our experiment!</p>
  <div class="prompt-continue">
  <button class="ctnBTN">Continue</button>
  </div>
  </div>`;
  const welcomeScreen = new Screen(jsPsych, welcomePrompt, ["NO_KEYS"], onLoadCallBack);



  //adding this event handler to deal with the continue button being pressed.

  function onLoadCallBack() {
    const ctnBTN = document.querySelector(".ctnBTN");

    ctnBTN.addEventListener("click", () => {
      jsPsych.finishTrial()
    })
  }


  const instructionsPrompt = `
  <div class="screen-prompt">
    <p>In this game you will be presented with abstract objects presented in series.
    Once in a while, you will be shown two abstract objects and you are required to pick the object, which you think
    is the next object.</p>
    <p >You will play a total of 8 blocks of this game!</p>
    <p>Good luck!</p>
    <div class="prompt-continue">
    <button class="ctnBTN">Continue</button>
    </div>
  </div>`;
  const instructionsScreen = new Screen(jsPsych, instructionsPrompt, ["NO_KEYS"], onLoadCallBack);

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
    <div class="screen-prompt">
    <p>The next block will begin. Continue when ready!</p>
    <div class="prompt-continue">
    <button class="ctnBTN">Continue</button>
    </div>
    </div>
`;
  const postBlockScreen = new Screen(jsPsych, postBlockPrompt, ["NO_KEYS"], onLoadCallBack);

  const secondBlockPrompt = `
    <div class="screen-prompt">
    <p>You will now do one final block where you sort the different features of the objects, based off
    the order in which they appeared.</p>
    <div class="prompt-continue">
    <button class="ctnBTN">Continue</button>
    </div>
    </div>`;
  const secondBlockScreen = new Screen(jsPsych, secondBlockPrompt, ["NO_KEYS"], onLoadCallBack);

  const endScreenPrompt = `
    <div class="screen-prompt">
    <p>You've have completed the game!</p>
    <p>Thank you for playing! </p>
    <div class="prompt-continue">
    <button class="ctnBTN">End Study</button>
    </div>
    </div>`;

  const endScreenCallback = () => {
    const ctnBTN = document.querySelector(".ctnBTN");

    ctnBTN.addEventListener("click", () => {
      const experimentData = jsPsych.data.get().csv();
      jatos.appendResultData(experimentData);
      console.log("Jatos appended data");
      jatos.endStudy();
      console.log("Jatos ended study");
      })
    
  };

  const endScreen = new Screen(
    jsPsych,
    endScreenPrompt,
    [" "],
    endScreenCallback
    
  );
});

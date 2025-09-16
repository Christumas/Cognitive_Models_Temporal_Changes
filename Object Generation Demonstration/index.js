const jsPsych = initJsPsych({
    override_safe_mode: true,
    on_finish: async function () {
      //jsPsych.data.get().localSave("csv","sampleData.csv")
    },
  });
  const timeline = [];
  const designFile = "DesignFile_1_session1.csv"

  async function runExperiment() {
    //grab design file
    
    //create experiment object
    const mainExperiment = new Experiment(jsPsych, designFile);
    //load the design file into the object so you can generate trials
    await mainExperiment.loadDesignFile(designFile);
    //generate the trials for each block
    await mainExperiment.generateTrials();
    //store the trials in a variable
    const experimentBlockTrials = mainExperiment.blockAndTrials;



    //add the trials to the timeline
    for (let block in experimentBlockTrials) {
      const trials = experimentBlockTrials[block];
      timeline.push(...trials);
      
    }


    jsPsych.run(timeline);
  }

  runExperiment();


    
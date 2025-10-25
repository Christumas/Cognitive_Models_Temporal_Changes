const colourVals = {
  Blue: "rgb(0, 0, 255, 0.6)",
  Red: "rgb(240, 45, 9,0.6)",
  Yellow: "rgb(255, 255, 0,0.6)",
  Pink: "rgb(235, 112, 245, 0.6)",
  Green: "rgb(26, 245, 0,0.6)",
  Grey: "rgb(128, 128, 128, 0.6)",
};

const textureMap = {
  Bricks: "Textures/texture_bricks.png",
  Dots: "Textures/texture_dots.png",
  Grid: "Textures/texture_grid.png",
  Waves: "Textures/texture_waves.png",
  Bottles: "Textures/texture_bottle.png",
  VerticalLines: "Textures/texture_verticalLines.png",
};

const colours = Object.keys(colourVals);

class Experiment {
  constructor(jsPsychInstance, designFilePath) {
    this.jsPsych = jsPsychInstance;
    this.designFilePath = designFilePath;
    this.colours = colourVals;
    this.textures = textureMap;
    this.shapes = [Rectangle, Semicircle, Circle, Hexagon, Star, Triangle];
    this.blockAndTrials = {};
    this.designFileData = [];
    this.blockScore = {};
    this.sortingTrials = [];
  }

  //preload all the images
  async preloadAssets() {
    try {
      console.log("added assets");
      return {
        type: jsPsychPreload,
        images: [
          "Textures/texture_bottle.png",
          "Textures/texture_bricks.png",
          "Textures/texture_dots.png",
          "Textures/texture_grid.png",
          "Textures/texture_verticalLines.png",
          "Textures/texture_waves.png",
          "Shapes/Circle.png",
          "Shapes/hexagon.png",
          "Shapes/rect.png",
          "Shapes/semicircle.png",
          "Shapes/Star.png",
          "Shapes/Triangle.png",
          "Colours/blue.png",
          "Colours/green.png",
          "Colours/grey.png",
          "Colours/pink.png",
          "Colours/red.png",
          "Colours/yellow.png",
        ],
      };
    } catch (error) {
      console.log(error);
    }
  }

  //load design file data. The randomized allocation of a design file for a participant will be handled
  //in the ExperimentMain.js file.
  async loadDesignFile() {
    try {
      let response = await fetch(this.designFilePath);
      if (!response.ok) throw new Error("couldnt fetch file");
      let data = await response.text();

      let parsedData = Papa.parse(data, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      this.designFileData = parsedData.data;
    } catch (error) {
      console.log(error);
    }
  }

  async generateTrials() {
    const table = this.designFileData;
    const uniqueBlocks = [...new Set(table.map((row) => row["Block Number"]))];
    const customScales = {
      Rectangle: 1.5,
      Semicircle: 1,
      Circle: 1,
      Hexagon: 1,
      Star: 1,
      Triangle: 1.5,
    };
    const shapeClasses = {
      Rectangle,
      Semicircle,
      Circle,
      Hexagon,
      Star,
      Triangle,
    };
    const jsPsych = this.jsPsych;

    for (let block of uniqueBlocks) {
      table.forEach((row) => {
        //all the regular stimulus trials
        let trialData = {
          // Block: row["Block Number"],
          // Stay_Prob_Colour: row["Stay_Probability(Colour)"],
          // Stay_Prob_Texture: row["Stay_Probability(Texture)"],
          // Stay_Prob_Shape: row["Stay_Probability(Shape)"],
          // Colour_stim: row["Colour_stim"],
          // Texture_stim: row["Texture_stim"],
          // Shape_stim: row["Shape_stim"],
          // Slow_stim: row["Slow_stim"],
          // Medium_stim: row["Medium_stim"],
          // Fast_stim: row["Fast_stim"],
          // Choice_Trial_Index: row["Choice Trial Index"],
          // Colour_distractor: row["Colour_distractor"],
          // Texture_distractor: row["Texture_distractor"],
          // Shape_distractor: row["Shape_distractor"],
          // Slow_distractor: row["Slow_distractor"],
          // Medium_distractor: row["Medium_distractor"],
          // Fast_distractor: row["Fast_distractor"],
          // Target_shares_colour: row["Target_shares_colour"],
          // Target_shares_texture: row["Target_shares_texture"],
          // Target_shares_shape: row["Target_shares_shape"],
          // Target_shares_slow: row["Target_shares_slow"],
          // Target_shares_medium: row["Target_shares_medium"],
          // Target_shares_fast: row["Target_shares_fast"],
          // Distractor_consistent_colour: row["Distractor_consistent_colour"],
          // Distractor_consistent_texture: row["Distractor_consistent_texture"],
          // Distractor_consistent_shape: row["Distractor_consistent_shape"],
          // Distractor_shares_colour_target: row["Distractor_shares_colour_target"],
          // Distractor_shares_texture_target: row["Distractor_shares_texture_target"],
          // Distractor_shares_shape_target: row["Distractor_shares_shape_target"],
          // Distractor_shares_slow_target: row["Distractor_shares_slow_target"],
          // Distractor_shares_medium_target: row["Distractor_shares_medium_target"],
          // Distractor_shares_fast_target: row["Distractor_shares_fast_target"],
          // Distractor_shares_colour_object: row["Distractor_shares_colour_object"],
          // Distractor_shares_texture_object: row["Distractor_shares_texture_object"],
          // Distractor_shares_shape_object: row["Distractor_shares_shape_object"],
          // Distractor_shares_slow_object: row["Distractor_shares_slow_object"],
          // Distractor_shares_medium_object: row["Distractor_shares_medium_object"],
          // Distractor_shares_fast_object: row["Distractor_shares_fast_object"],
          ...row,
          Stim_Canvas: "",
          Distractor_Canvas: "",
          Keypress: "",
          Touch_Target: "", //this is for when participants use a phone or tablet to do the task
          Response_Correct: "",
          RT: "",
        };

        const colourGraph = JSON.parse(row["Colour_Graph"].replace(/'/g, '"'));
        const textureGraph = JSON.parse(
          row["Texture_Graph"].replace(/'/g, '"')
        );
        const shapeGraph = JSON.parse(row["Shape_Graph"].replace(/'/g, '"'));

        if (row["Block Number"] === block) {
          if (!row["Choice Trial Index"]) {
            const colourName = colourGraph[row["Colour_stim"]];
            const colourNode = colourVals[colourName];

            const textureNode = textureMap[textureGraph[row["Texture_stim"]]];
            const shapeNode = shapeGraph[row["Shape_stim"]];

            // console.log(row["Colour_stim"],row["Texture_stim"], row["Shape_stim"])
            const trial = {
              type: jsPsychHtmlKeyboardResponse,
              stimulus: ` <div class="canvas-holder">
                            <canvas id="jspsych-canvas-keyboard-response-stimulus" width=300 height=300></canvas>
                        </div>`,
              on_load: function () {
                //drawing logic
                const shapeInstance = new shapeClasses[shapeNode](
                  colourNode,
                  textureNode,
                  customScales[shapeNode]
                );
                shapeInstance.draw();
              },
              choices: "NO_KEYS",
              trial_duration: 1000,
              post_trial_gap: 300,
              data: {
                Block: block,
                Stay_Prob_Colour: row["Stay_Probability(Colour)"],
                Stay_Prob_Shape: row["Stay_Probability(Shape)"],
                Stay_Prob_Texture: row["Stay_Probability(Texture)"],
                Slow_stim: row["Slow_stim"],
                Medium_stim: row["Medium_stim"],
                Fast_stim: row["Fast_stim"],
                Colour_stim: row["Colour_stim"],
                Shape_stim: row["Shape_stim"],
                Texture_stim: row["Texture_stim"],
              },
            };

            if (!this.blockAndTrials[block]) {
              this.blockAndTrials[block] = [];
            }
            this.blockAndTrials[block].push(trial);
          } else if (row["Choice Trial Index"]) {
            const trialNumber = row["Trial Number"];

            const colourNodeStim = colourVals[colourGraph[row["Colour_stim"]]];
            const textureNodeStim =
              textureMap[textureGraph[row["Texture_stim"]]];
            const shapeNodeStim = shapeGraph[row["Shape_stim"]];

            const colourNodeDistractor =
              colourVals[colourGraph[row["Colour_distractor"]]]; //change to distractor
            const textureNodeDistractor =
              textureMap[textureGraph[row["Texture_distractor"]]]; //change to distractor
            const shapeNodeDistractor = shapeGraph[row["Shape_distractor"]]; //change to distractor
            const canvasIDs = [
              `canvas-1-${trialNumber}`,
              `canvas-2-${trialNumber}`,
            ];

            const canvasToSideMap = {
              "canvas-1": "Left",
              "canvas-2": "Right",
            };

            const choiceTrial = {
              type: jsPsychHtmlKeyboardResponse,
              stimulus: ` <div class="choice-prompt">
              <p>Which of these objects will come next?</p>
              </div>
              <div class="canvas-holder-choice">
                            <div class="holder-1">
                            <canvas class="jspsych-canvas-keyboard-response-stimulus" id="canvas-1-${trialNumber}" width=300 height=300></canvas>
                            <p class="feedback"></p>
                            </div>
                            <div class="holder-2">
                            <canvas class="jspsych-canvas-keyboard-response-stimulus" id="canvas-2-${trialNumber}" width=300 height=300></canvas>
                            <p class="feedback"></p>
                          </div>`,
              choices: "NO_KEYS",
              response_ends_trial: false,
              post_trial_gap: 300,
              on_load: function () {
                //manually add RT data because using response_ends_trial prevents rt from being recorded by the plugin
                const trialStart = performance.now();

                //shuffle the canvas ids on every choice trial so the stimulus and generated objects
                //are drawn on different canvases
                for (let i = canvasIDs.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [canvasIDs[i], canvasIDs[j]] = [canvasIDs[j], canvasIDs[i]];
                }

                //participants should choose the next shape according to the graph structure, so the
                //stimulus shapes, therefore the correct answer should be the canvas at index [0] in the array

                //drawing logic
                const shapeInstanceStim = new shapeClasses[shapeNodeStim](
                  colourNodeStim,
                  textureNodeStim,
                  customScales[shapeNodeStim]
                );
                shapeInstanceStim.draw(canvasIDs[0]);
                trialData["Stim_Canvas"] = canvasIDs[0];

                const shapeInstanceDistractor = new shapeClasses[
                  shapeNodeDistractor
                ](
                  colourNodeDistractor,
                  textureNodeDistractor,
                  customScales[shapeNodeDistractor]
                );
                shapeInstanceDistractor.draw(canvasIDs[1]);
                trialData["Distractor_Canvas"] = canvasIDs[1];

                //add the stimulus and distractor canvas onto the trial data
                //split the trial number from the canvas ID to just get either canvas-1 or canvas-2 to get the corresponding sides
                trialData["Stim_Canvas"] =
                  canvasToSideMap[
                    canvasIDs[0].split("-").slice(0, 2).join("-")
                  ];
                trialData["Distractor_Canvas"] =
                  canvasToSideMap[
                    canvasIDs[1].split("-").slice(0, 2).join("-")
                  ];

                let correctOption = canvasIDs[0];
                let incorrectOption = canvasIDs[1];

                console.log("Correct option", correctOption);

                if (
                  document.querySelector(`#${correctOption}`) &&
                  document.querySelector(`#${incorrectOption}`)
                ) {
                  //handle keypresses
                  function keyHandler(event) {
                    const keyPress = event.key;

                    if (keyPress !== "ArrowLeft" && keyPress !== "ArrowRight") {
                      return;
                    }

                    trialData["Keypress"] = keyPress;
                    const keyPressTime = performance.now();
                    const reactionTimeForTrial = Math.round(
                      keyPressTime - trialStart
                    );
                    trialData["RT"] = reactionTimeForTrial;
                    const correctCanvas = correctOption;
                    let chosenCanvasID = null;

                    if (keyPress == "ArrowLeft") {
                      chosenCanvasID = `canvas-1-${trialNumber}`;
                    } else if (keyPress == "ArrowRight") {
                      chosenCanvasID = `canvas-2-${trialNumber}`;
                    }

                    if (chosenCanvasID == correctCanvas) {
                      let response = true;
                      trialData["Response_Correct"] = 1;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);

                      document.removeEventListener("keydown", keyHandler);
                      setTimeout(() => {
                        jsPsych.finishTrial(trialData);
                      }, 1000);
                    } else {
                      let response = false;
                      trialData["Response_Correct"] = 0;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);
                      document.removeEventListener("keydown", keyHandler);
                      setTimeout(() => {
                        jsPsych.finishTrial(trialData);
                      }, 1000);
                    }
                  }
                  //handle touch screen behaviour for mobile
                  function touchHandler(event) {
                    event.preventDefault();
                    const touchTarget = event.target.id;
                    const keyPressTime = performance.now();
                    const reactionTimeForTrial = Math.round(
                      keyPressTime - trialStart
                    );
                    trialData["RT"] = reactionTimeForTrial;
                    const correctCanvas = correctOption;
                    let chosenCanvasID = null;
                    if (touchTarget === `canvas-1-${trialNumber}`) {
                      chosenCanvasID = `canvas-1-${trialNumber}`;
                      trialData["Touch_Target"] = "Left";
                    } else if (touchTarget === `canvas-2-${trialNumber}`) {
                      trialData["Touch_Target"] = "Right";
                      chosenCanvasID = `canvas-2-${trialNumber}`;
                    }

                    if (chosenCanvasID == correctCanvas) {
                      let response = true;
                      trialData["Response_Correct"] = 1;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);

                      document.removeEventListener("keydown", keyHandler);
                      document
                        .querySelector(`#canvas-1-${trialNumber}`)
                        .removeEventListener("touchStart", touchHandler);
                      document
                        .querySelector(`#canvas-2-${trialNumber}`)
                        .removeEventListener("touchStart", touchHandler);

                      setTimeout(() => {
                        jsPsych.finishTrial(trialData);
                      }, 1000);
                    } else {
                      let response = false;
                      trialData["Response_Correct"] = 0;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);

                      document.removeEventListener("keydown", keyHandler);
                      document
                        .querySelector(`#canvas-1-${trialNumber}`)
                        .removeEventListener("touchStart", touchHandler);
                      document
                        .querySelector(`#canvas-2-${trialNumber}`)
                        .removeEventListener("touchStart", touchHandler);
                      setTimeout(() => {
                        jsPsych.finishTrial(trialData);
                      }, 1000);
                    }
                  }

                  //add the event listeners for desktop and mobile
                  document.addEventListener("keydown", keyHandler);
                  document
                    .querySelector(`#canvas-1-${trialNumber}`)
                    .addEventListener("touchstart", touchHandler, {
                      passive: false,
                    });
                  document
                    .querySelector(`#canvas-2-${trialNumber}`)
                    .addEventListener("touchstart", touchHandler, {
                      passive: false,
                    });
                }
              },
            };
            this.blockAndTrials[block].push(choiceTrial);
          }
        }
      });
    }
  }

  generatePerformanceSummary(blockNumber) {
    //adding this because inside jatos an error gets thrown: TypeError: can't access property "jsPsych", this is undefined
    const jsPsych = this.jsPsych;

    function calculateScore(score) {
      if (Array.isArray(score)) {
        if (score.length === 0) {
          return 0;
        }

        //provide the score as a percentage
        let initialValue = 0;
        const sum = score.reduce((partialSum, currentValue) => {
          return partialSum + currentValue;
        }, initialValue);

        let percentageScore = (sum / score.length) * 100;

        return percentageScore.toFixed(2);
      } else {
        //if score is an object from jspsych.data.get()
        let initialValue = 0;
        let scoreArray = score.values;
        const sum = scoreArray.values.reduce((partialSum, currentValue) => {
          return partialSum + currentValue;
        }, initialValue);

        let percentageScore = (sum / scoreArray.length) * 100;
        return percentageScore.toFixed(1);
      }
    }

    function evaluateScore(percentageScore) {
      let evaluation;

      switch (true) {
        case percentageScore < 50:
          evaluation = "You could do better!";
          break;

        case percentageScore < 70:
          evaluation = "Good job, keep going!";
          break;

        case percentageScore < 80:
          evaluation = "Very nicely done!";
          break;

        case percentageScore < 90:
          evaluation = "Excellent, you are on fire!!";
          break;

        case percentageScore <= 100:
          evaluation = "A Perfect score! Be proud of yourself!";
          break;

        default:
          evaluation = "Try harder! You got this!";
      }

      return evaluation;
    }

    //return the performance screen
    const performanceScreen = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
        <div class="evaluationBox">
            <p id="scoreDescription">You got <span id="percentageScore"></span> right in 
            block ${blockNumber}!</p>
            <p id="evaluation"></p>
            <h3>Press continue with the next block when you are ready!</h3>
            <div class="prompt-continue">
            <button class="ctnBTN">Continue</button>
        </div>
        
        </div>`,
      choices: ["NO_KEYS"],
      on_load: function () {
        let allTrials = jsPsych.data.get().values();

        const scoreArray = allTrials
          .filter(
            (trial) =>
              trial.Block == blockNumber && trial.Response_Correct !== undefined
          )
          .map((trial) => trial.Response_Correct);

        console.log("scoreArray", scoreArray);

        let percentageCorrect = calculateScore(scoreArray);
        let evaluationMessage = evaluateScore(percentageCorrect);

        const percentageScore = document.querySelector("#percentageScore");
        percentageScore.textContent = `${percentageCorrect}%`;
        const evaluation = document.querySelector("#evaluation");
        evaluation.textContent = evaluationMessage;

        const ctnBTN = document.querySelector(".ctnBTN");

        ctnBTN.addEventListener("click", () => {
          jsPsych.finishTrial();
        });
      },
    };

    return performanceScreen;
  }

  async createSortingBlock() {
    const shapeImages = [
      "Shapes/Circle.png",
      "Shapes/hexagon.png",
      "Shapes/rect.png",
      "Shapes/semicircle.png",
      "Shapes/Star.png",
      "Shapes/Triangle.png",
    ];

    const textureImages = [
      "Textures/texture_bottle.png",
      "Textures/texture_bricks.png",
      "Textures/texture_dots.png",
      "Textures/texture_grid.png",
      "Textures/texture_verticalLines.png",
      "Textures/texture_waves.png",
    ];

    const colourImages = [
      "Colours/blue.png",
      "Colours/green.png",
      "Colours/grey.png",
      "Colours/pink.png",
      "Colours/red.png",
      "Colours/yellow.png",
    ];

    const sortingMap = {
      Colour: colourImages,
      Texture: textureImages,
      Shape: shapeImages,
    };

    const dimensions = ["Colour", "Texture", "Shape"];

    let trials = dimensions
      .sort(() => Math.random() - 0.5)
      .map((dimension) => {
        return {
          type: jsPsychFreeSort,
          stimuli: sortingMap[dimension],
          prompt: `
          <div class="free-sort-prompt">
          <p>Please arrange the stimuli according to ${dimension}, in the order you believe they appeared </p>
          </div>`,
          sort_area_shape: "ellipse",
          sort_area_height: 600,
          sort_area_width: 600,
          prompt_location: "above",
          stim_starts_inside: false,
          scale_factor: 1,
        };
      });

    this.sortingTrials = [...trials];
  }

  generateFeedbackForm(questions) {
    let rows = 10;
    let columns = 100;
    let textArea = {
      type: jsPsychSurveyText,
      questions: questions.map((question) => {
        return { prompt: question, rows: rows, columns: columns };
      }),
      rows: 10,
      columns: 20,
    };
    return textArea;
  }
}

const colourVals = {
  Teal: "rgb(3, 135, 104, 0.5)",
  Red: "rgb(189, 38, 38,0.5)",
  "Mustard Yellow": "rgb(252, 181, 25,0.5)",
  Pink: "rgb(255, 3, 154, 0.5)",
  Green: "rgb(17, 199, 0,0.5)",
  Azure: "rgb(3, 221, 255, 0.5)",
  Blue: "rgb(66, 3, 255, 0.5)",
};

const textures = [
  "Textures/texture_bricks.png",
  "Textures/texture_dots.png",
  "Textures/texture_grid.png",
  "Textures/texture_waves.png",
  "Textures/texture_bottle.png",
  "Textures/texture_flannel.png",
  "Textures/texture_verticalLines.png"
];

const colours = Object.keys(colourVals);

//for the graph visualization
const colNodes = [
  "Teal",
  "Red",
  "Mustard Yellow",
  "Pink",
  "Green",
  "Azure",
  "Blue"
];

const textNodes = [
 "Bricks",
 "Dots",
 "Grid",
 "Waves",
 "Bottle",
 "Flannel",
 "VerticalLines"
];

const shapeNodes = [
  "Rect",
  "Semicircle",
  "Circle",
  "Hexagon",
  "Star",
  "Pacman",
  "Triangle",
];

class Experiment {
  constructor(jsPsychInstance, designFilePath) {
    this.jsPsych = jsPsychInstance;
    this.designFilePath = designFilePath;
    this.colours = colourVals;
    this.textures = textures;
    this.shapes = [
      Rectangle,
      Semicircle,
      Circle,
      Hexagon,
      Star,
      Pacman,
      Triangle,
    ];
    this.blockAndTrials = {};
    this.designFileData = [];
    this.blockScore = {};
    this.sortingTrials = [];
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
    const shapes = this.shapes;
    const customScales = [1, 1, 1, 1, 1.5, 1, 1.5];
    const jsPsych = this.jsPsych;

    function clearHighlights() {
      document
        .querySelectorAll(".node-highlight-stim, .node-highlight-distractor")
        .forEach((el) =>
          el.classList.remove(
            "node-highlight-stim",
            "node-highlight-distractor"
          )
        );
    }

    function highlightNode(name, role = "stim") {
      const el = document.getElementById(name);
      if (!el) return;
      el.classList.add(
        role === "stim" ? "node-highlight-stim" : "node-highlight-distractor"
      );
    }

    function updateCurrentNodesStim(colour, texture, shape) {
      document.getElementById("colorStim").textContent = `Colour Stim: ${colour}`;
      document.getElementById("textureStim").textContent = `Texture Stim: ${texture}`;
      document.getElementById("shapeStim").textContent = `Shape Stim: ${shape}`;
    }

    function updateCurrentNodesDist(colour, texture, shape) {
      document.getElementById("colorDist").textContent = `Colour Dist: ${colour}`;
      document.getElementById("textureDist").textContent = `Texture Dist: ${texture}`;
      document.getElementById("shapeDist").textContent = `Shape Dist: ${shape}`;
    }

    for (let block of uniqueBlocks) {
      table.forEach((row) => {
        //all the regular stimulus trials

        if (row["Block Number"] === block) {
          if (!row["Choice Trial Index"]) {
            const colourNode = colourVals[colours[row["Colour_stim"]]];
            const textureNode = textures[row["Texture_stim"]];
            const shapeNode = row["Shape_stim"];

            const graphColour = colNodes[row["Colour_stim"]];
            const graphTexture = textNodes[row["Texture_stim"]];
            const graphShape = shapeNodes[row["Shape_stim"]];

            const trial = {
              type: jsPsychHtmlKeyboardResponse,
              stimulus: ` <div class="canvas-holder">
                            <canvas id="jspsych-canvas-keyboard-response-stimulus" width=300 height=300></canvas>
                        </div>`,
              on_load: function () {
                //drawing logic
                clearHighlights();
                highlightNode(graphColour,"stim");
                highlightNode(graphTexture,"stim");
                highlightNode(graphShape,"stim")
                updateCurrentNodesStim(row["Colour_stim"], row["Texture_stim"] , row["Shape_stim"])

                const shapeInstance = new shapes[shapeNode](
                  colourNode,
                  textureNode,
                  customScales[shapeNode]
                );
                shapeInstance.draw();
              },
              choices: [" "],
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
            const colourNodeStim = colourVals[colours[row["Colour_stim"]]];
            const textureNodeStim = textures[row["Texture_stim"]];
            const shapeNodeStim = row["Shape_stim"];

            const colourNodeDistractor =
              colourVals[colours[row["Colour_distractor"]]]; //change to distractor
            const textureNodeDistractor = textures[row["Texture_distractor"]]; //change to distractor
            const shapeNodeDistractor = row["Shape_distractor"]; //change to distractor

            const graphColour = colNodes[row["Colour_stim"]];
            const graphTexture = textNodes[row["Texture_stim"]];
            const graphShape = shapeNodes[row["Shape_stim"]];

            const graphColourDist = colNodes[row["Colour_distractor"]]
            const graphTextureDist = textNodes[row["Texture_distractor"]]
            const graphShapeDist = shapeNodes[row["Shape_distractor"]]



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
              <p>Which of these objects are likely to come next?</p>
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


                clearHighlights();
                //highlight stim nodes on the graph
                clearHighlights();
                highlightNode(graphColour,"stim");
                highlightNode(graphTexture,"stim");
                highlightNode(graphShape,"stim")
                updateCurrentNodesStim(row["Colour_stim"], row["Texture_stim"] , row["Shape_stim"]);

                highlightNode(graphColourDist,"distractor");
                highlightNode(graphTextureDist,"distractor");
                highlightNode(graphShapeDist,"distractor")
                 updateCurrentNodesDist(row["Colour_distractor"], row["Texture_distractor"] , row["Shape_distractor"]);


                



                //shuffle the canvas ids on every choice trial so the stimulus and generated objects
                //are drawn on different canvases
                for (let i = canvasIDs.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [canvasIDs[i], canvasIDs[j]] = [canvasIDs[j], canvasIDs[i]];
                }

                //participants should choose the next shape according to the graph structure, so the
                //stimulus shapes, therefore the correct answer should be the canvas at index [0] in the array

                //drawing logic
                const shapeInstanceStim = new shapes[shapeNodeStim](
                  colourNodeStim,
                  textureNodeStim,
                  customScales[shapeNodeStim]
                );
                shapeInstanceStim.draw(canvasIDs[0]);

                const shapeInstanceDistractor = new shapes[shapeNodeDistractor](
                  colourNodeDistractor,
                  textureNodeDistractor,
                  customScales[shapeNodeDistractor]
                );
                shapeInstanceDistractor.draw(canvasIDs[1]);
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


                    const correctCanvas = correctOption;
                    let chosenCanvasID = null;

                    if (keyPress == "ArrowLeft") {
                      chosenCanvasID = `canvas-1-${trialNumber}`;
                    } else if (keyPress == "ArrowRight") {
                      chosenCanvasID = `canvas-2-${trialNumber}`;
                    }

                    if (chosenCanvasID == correctCanvas) {
                      let response = true;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);

                      document.removeEventListener("keydown", keyHandler);
                      setTimeout(() => {
                        jsPsych.finishTrial();
                      }, 1000);
                    } else {
                      let response = false;
                      const feedback = new Feedback();
                      feedback.draw(chosenCanvasID, response);
                      document.removeEventListener("keydown", keyHandler);
                      setTimeout(() => {
                        jsPsych.finishTrial();
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
                    const correctCanvas = correctOption;
                    let chosenCanvasID = null;
                    if (touchTarget === `canvas-1-${trialNumber}`) {
                      chosenCanvasID = `canvas-1-${trialNumber}`;
                    } else if (touchTarget === `canvas-2-${trialNumber}`) {
                      chosenCanvasID = `canvas-2-${trialNumber}`;
                    }

                    if (chosenCanvasID == correctCanvas) {
                      let response = true;
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
                        jsPsych.finishTrial();
                      }, 1000);
                    } else {
                      let response = false;
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
                        jsPsych.finishTrial();
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

  async createSortingBlock() {
    const shapeImages = [
      "Shapes/Circle.png",
      "Shapes/hexagon.png",
      "Shapes/Pacman.png",
      "Shapes/rect.png",
      "Shapes/semicircle.png",
      "Shapes/Star.png",
      "Shapes/Triangle.png",
    ];

    const textureImages = [
      "Textures/texture_bottle.png",
      "Textures/texture_bricks.png",
      "Textures/texture_dots.png",
      "Textures/texture_flannel.png",
      "Textures/texture_grid.png",
      "Textures/texture_verticalLines.png",
      "Textures/texture_waves.png",
    ];

    const colourImages = [
      "Colours/azure.png",
      "Colours/blue.png",
      "Colours/green.png",
      "Colours/mustardYellow.png",
      "Colours/pink.png",
      "Colours/red.png",
      "Colours/teal.png",
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
}

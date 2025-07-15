const jsPsych = initJsPsych();
const timeline = []

//the shapes will be drawn using the on_load parameter of the jsPsychHtmlKeyboardResponse plugin
//the canvas plugin only lets us take one argument which is disadvantageous as we need control of the shape colour and texture


// Find the size of the bounding box of the canvas element. This is essential to calculate the 
// offset needed to ensure that the shape is centered. The size of the bounding box is essentially
// the size of the shape. By getting the center of the shape, we can then calculate the offset
// required to ensure that the shape is drawn dead center inside the canvas. This does not apply
// to circular shapes as they get drawn naturally in the center of the canvas

function getBoundingBox(canvasWidth, canvasHeight, Paths){
    let minX = Infinity, minY = Infinity; //left most edge of the box
    let maxX = -Infinity, maxY = -Infinity; //right most edge of the box

    Paths.forEach( ([x,y])=>{
        if (x < minX) {minX = x};
        if (y < minY) {minY = y};
        if (x > maxX) {maxX = x};
        if (y > maxY) {maxY = y};
    })

    const boundingWidth = maxX - minX; //width of the shape aka bounding box
    const boundingHeight = maxY - minY; //height of the shape aka bounding box

    const canvasCenterX = canvasWidth / 2; //x position of the canvas element center
    const canvasCenterY = canvasHeight / 2; //y position of the canvas element center

    const boundingCenterX = minX + boundingWidth/2 //x position of the bounding box center
    const boundingCenterY = minY + boundingHeight/2 //y position of the bounding box center

    const offsetX = canvasCenterX - boundingCenterX;
    const offsetY = canvasCenterY - boundingCenterY;

    return [offsetX, offsetY]


}


function drawRect(colour=null, texture=null, c=null, scale = 1.5){

    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }

    const context = canvas.getContext('2d')
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    const rectangleWidth = 100 * scale;
    const rectangleHeight = 100 * scale;

    const Xpos = (canvas_width/2) - (rectangleWidth/2) ;
    const Ypos = (canvas_height/2) - (rectangleHeight/2);

    context.rect(Xpos,Ypos,rectangleWidth,rectangleHeight);
    context.save()
    context.clip()

    if (texture){
        const img = new Image();
        // console.log("texture is present")
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            
            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }
    

}


function drawPlus(colour=null, texture=null, c=null){    

    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }

    paths = [
        [0,0],
        [0, 25],
        [50, 25],
        [50,75],
        [75,75],
        [75,25],
        [125,25],
        [125,0],
        [75,0],
        [75,-50],
        [50,-50],
        [50,0],
        [0,0]
    ]
    
    const context = canvas.getContext('2d')

    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    let [offsetX, offsetY] = getBoundingBox(canvas_width, canvas_height, paths);

    context.beginPath();
    paths.forEach( ([dx,dy],index) => {
        const x = offsetX + dx;
        const y = offsetY + dy;

        if(index === 0){
            context.moveTo(x,y)
        }
        else{
            context.lineTo(x,y)
        }
    })
    context.save()
    context.clip()

    if (texture){
        const img = new Image();
        // console.log("texture is present")
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }

}

function drawSemiCircle(colour=null,texture=null, c=null, scale=1){
    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus");
    }   

    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    const startX = canvas_width / 2
    const startY = canvas_height / 2
    const radius = 100*scale


    // arc(x, y, radius, startAngle, endAngle, counterclockwise)
    context.beginPath(startX,startY)
    context.arc(startX, startY,radius, Math.PI, 0, true)
    context.lineWidth = 4;
    context.closePath()
    context.stroke();

    if(texture){
        const img = new Image();
        // console.log("texture is present")
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

}


function drawTriangle(colour=null, texture=null,c=null, scale=1.5){
    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }
    
    const paths = [
        [0,0],
        [60 *scale,-100 * scale],
        [120 *scale,0*scale]
    ]
    

    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    let [offsetX, offsetY] = getBoundingBox(canvas_width, canvas_height, paths);

    context.beginPath();
    paths.forEach( ([dx, dy], index) =>{
        const x = offsetX + dx;
        const y = offsetY + dy;

        if (index == 0){
            context.moveTo(x,y)
        } else {
            context.lineTo(x,y)
        }
    })

    context.closePath()
    context.save()
    context.clip()

    if (texture){
        const img = new Image();
        // console.log("texture is present")
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }
}


function drawPacman(colour=null, texture=null, c=null, scale=1){

    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;


    const startX = canvas_width/2;  
    const startY = canvas_height/2;
    const radius = 100 * scale;
    context.beginPath()
    context.arc(startX,startY,radius, 0, Math.PI*1.5, false)
    context.lineTo(startX,startY)
    context.closePath()
    context.fill()

    context.save()
    context.clip()

    if (texture){
        // console.log("texture is present")
        const img = new Image();
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }

}

function drawCircle(colour=null, texture=null, c=null, scale=1){
   
    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;


    const canvasCenterX = canvas_width/2;
    const canvasCenterY = canvas_height/2;
    const radius = 100 * scale;
    context.arc(canvasCenterX,canvasCenterY,radius, 0, Math.PI*2, false)
    context.fill()

    context.save()
    context.clip()

    if (texture){
        const img = new Image();
        // console.log("texture is present")
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }

}

function drawStar(colour=null, texture=null, c=null, scale=1){

    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }

    const spikes = 5 
    const outerRadius = 100 * scale 
    const innerRadius = 50 * scale
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    let step = Math.PI / spikes
    let rotation = Math.PI /2*3
    let centreX = canvas_width/2;
    let centreY = canvas_height/2;

    context.beginPath();
    context.moveTo(centreX, centreY - outerRadius);
    for (let i=0; i<spikes; i++){
        var x = centreX + Math.cos(rotation)*outerRadius
        var y = centreY + Math.sin(rotation)*outerRadius
        context.lineTo(x,y)
        rotation += step;

        var x = centreX + Math.cos(rotation)*innerRadius
        var y = centreY + Math.sin(rotation)*innerRadius
        context.lineTo(x,y)
        rotation += step;
    }

    context.closePath()

    context.save()
    context.clip()
    
    if (texture){
        // console.log("texture is present")
        const img = new Image();
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        console.log("Texture not present")
        context.lineWidth = 3
        context.stroke();
    }

}


function drawHexagon(colour, texture, c=null, scale = 1){
    
    let canvas
    if (c){
        canvas = document.querySelector(`#${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    }

    const context = canvas.getContext('2d');

    const size = 100 * scale; //basically radius because the hexagon will be drawn using a circle as reference
    const sides = 6; //how many sides the polygon should have

    const shapeCentreX = canvas.clientWidth / 2;
    const shapeCentreY = canvas.clientHeight / 2;

    context.moveTo(shapeCentreX + size * Math.cos(0), shapeCentreY + size * Math.sin(0))

    for (let i=1; i<=sides; i++){
        context.lineTo(
            shapeCentreX + size * Math.cos(i * 2 * Math.PI / sides),
            shapeCentreY + size * Math.sin(i * 2* Math.PI /sides)
        );
    }

    context.save()
    context.clip()

    if (texture){
        const img = new Image();
        img.src = texture;
        img.onload = () => {
            const pattern = context.createPattern(img,'repeat') 
            context.fillStyle = pattern;
            context.fill()

            context.fillStyle = colour;
            context.fill()
            context.restore()

            context.lineWidth = 3;
            context.stroke()
        }

    }

    else{
        context.lineWidth = 2;
        context.stroke()
    }
    
}

function drawFeedback(imageSource,correctFeedback,c){
    let canvas
    if (c){
        canvas = c.getContext('2d');
    }

    let feedbackImage 
    if (correctFeedback){
        feedbackImage = imageSource[0];
    }

    else{
        feedbackImage = imageSource[1];
    }
    

    const img = new Image();
    img.src  = feedbackImage;
    img.onload = () => {
        canvas.drawImage(img,0,0, 125,125)
    }

}

const feedbackImgSource = ['images/positive_tick.png', 'images/negative_cross.png']




// Experiment Logic


const drawShapes = [
    drawCircle,
    drawHexagon,
    drawPacman,
    drawSemiCircle,
    drawRect,
    drawStar,
    drawTriangle
]

const colourVals = {
    "Red" : "rgb(189, 38, 38,0.5)",
    "Mustard Yellow" : "rgb(252, 181, 25,0.5)",
    "Teal": "rgb(3, 135, 104, 0.5)",
    "Green": "rgb(17, 199, 0,0.5)",
    "Pink": "rgb(255, 3, 154, 0.5)",
    "Azure": "rgb(3, 221, 255, 0.5)",
    "Blue" : "rgb(66, 3, 255, 0.5)"
}


const textures = [
    "Textures/texture_bottle.png",
    "Textures/texture_bricks.png",
    "Textures/texture_dots.png",
    "Textures/texture_flannel.png",
    "Textures/texture_grid.png",
    "Textures/texture_verticalLines.png",
    "Textures/texture_waves.png"
]

//function to get the design file
async function getFile(file) {
    try{
        const response = await fetch(file);
        if (!response.ok) throw new Error("couldnt fetch file")
        const data = await response.text()

        let parsedData = Papa.parse(data, {
            header:true,
            dynamicTyping:true,
            skipEmptyLines:true
        })

        return parsedData.data;

    }

    catch(error){
        console.log("Couldnt load file")

    }  
}

//function to generate trials specified by designfile
async function generateTrials(functionArray, colourdict, textureArray,designFile){
    const colours = Object.keys(colourdict)
    console.log(colours)
    const trials = []

    const table = await getFile(designFile);
    table.forEach( (row) => {
        if (!row["Colour_choice"] && !row["Shape_choice"] && !row["Texture_choice"]){
            const colourNode = colourVals[colours[row["Colour_stim"]]];
            const textureNode = textures[row["Texture_stim"]];
            const shapeNode = row["Shape_stim"];

             let trialData = {
                'Colour_stim':row["Colour_stim"],
                'Texture_stim':row["Texture_stim"],
                'Shape_stim': row["Shape_stim"],
                'Colour_choice':row["Colour_choice"],
                'Shape_choice': row["Shape_choice"],
                'Texture_choice' : row["Texture_choice"],
                'Response': 0,
                'Stim_Canvas': '',
                'Choice_Canvas': '',
                'Response_Correct': ''

            }

            const trial = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: ` <div class="canvas-holder">
                            <canvas id="jspsych-canvas-keyboard-response-stimulus" width=400 height=400 style="border:2px solid black;"></canvas>
                            </div>`,
                on_load : function(){
                    drawShapes[shapeNode](colourNode,textureNode)
                },
                keys: [],
                trial_duration: 1000,
                post_trial_gap: 300,
                data: {'Colour_stim': row["Colour_stim"],
                        'Shape_stim': row["Shape_stim"],
                        'Texture_stim' : row["Texture_stim"]
                }
            }
            trials.push(trial)

        }

        else{
            const colourNodeStim = colourVals[colours[row["Colour_stim"]]];
            const textureNodeStim = textures[row["Texture_stim"]];
            const shapeNodeStim = row["Shape_stim"];

            const colourNodeChoice = colourVals[colours[row["Colour_choice"]]];
            const textureNodeChoice = textures[row["Texture_choice"]];;
            const shapeNodeChoice = row["Shape_choice"]

            const trialIndex = trials.length;
            const canvasIDs = [`canvas-1-${trialIndex}`,`canvas-2-${trialIndex}`]

            //manually add the relevant data as we are manually ending the trial 
            let trialData = {
                'Colour_stim':row["Colour_stim"],
                'Texture_stim':row["Texture_stim"],
                'Shape_stim': row["Shape_stim"],
                'Colour_choice':row["Colour_choice"],
                'Shape_choice': row["Shape_choice"],
                'Texture_choice' : row["Texture_choice"],
                'Response': 0,
                'Stim_Canvas': '',
                'Choice_Canvas': '',
                'Response_Correct': ''

            }
            

            const choice_trial = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus:` <div class="canvas-holder" style="display:flex; gap:1rem;">
                            <div class="holder-1">
                            <canvas class="jspsych-canvas-keyboard-response-stimulus" id="canvas-1-${trialIndex}" width=400 height=400 style="border:2px solid black;"></canvas>
                            <p class="feedback"></p>
                            </div>
                            <div class="holder-2">
                            <canvas class="jspsych-canvas-keyboard-response-stimulus" id="canvas-2-${trialIndex}" width=400 height=400 style="border:2px solid black;"></canvas>
                            <p class="feedback"></p>
                            </div>`,
                choices : ["ArrowLeft", "ArrowRight"],
                prompt: `<p style="margin-top:0.5rem;">Which of these objects are likely to come next?</p>`,
                response_ends_trial:false,
                on_load: function() {

                    //shuffle the canvas ids on every choice trial so the stimulus and generated objects
                    //are drawn on different canvases
                    for (let i = canvasIDs.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [canvasIDs[i], canvasIDs[j]] = [canvasIDs[j], canvasIDs[i]];
                    console.log(canvasIDs[0],canvasIDs[1])
                    }
                    
                    //participants should choose the next shape according to the graph structure, so the 
                    //stimulus shapes, therefore the correct answer should be the canvas at index [0] in the array

                    drawShapes[shapeNodeStim](colourNodeStim,textureNodeStim, canvasIDs[0])
                    drawShapes[shapeNodeChoice](colourNodeChoice, textureNodeChoice, canvasIDs[1]) 

                    console.log("Correct option:", canvasIDs[0])
                    console.log("Incorrect option:", canvasIDs[1])

                    let correctOption = canvasIDs[0];
                    let incorrectOption = canvasIDs[1];

                    trialData["Choice_Canvas"] = canvasIDs[1]; //update our trial data object
                    trialData["Stim_Canvas"] = canvasIDs[0];
                    
                    if (document.querySelector(`#${correctOption}`) || document.querySelector(`#${incorrectOption}`))
                        {
                        // console.log("the canvases exist")
                        document.addEventListener("keydown", (event)=> {

                        const feedbackCorrect = "✅";
                        const feedbackIncorrect = "❌";
                    
                        const keyPress = event.key;
                        trialData["Response"] = keyPress;
                        const correctCanvas = correctOption;
                        let chosenCanvasID = null;

                        if (keyPress == "ArrowLeft"){
                            chosenCanvasID = `canvas-1-${trialIndex}`
                            console.log("Chosen Canvas:", chosenCanvasID)

                        } else if(keyPress == "ArrowRight"){
                            chosenCanvasID = `canvas-2-${trialIndex}`
                            console.log("Chosen Canvas:", chosenCanvasID)
                        }
                        
                        if (chosenCanvasID == correctCanvas ){
                            trialData["Chosen_Canvas"] = chosenCanvasID;
                            trialData["Response_Correct"] = "true"
                            const chosenCanvas = document.querySelector(`#${chosenCanvasID}`)
                            drawFeedback(feedbackImgSource,true,chosenCanvas);


                            // const parent = chosenCanvas.parentElement
                            // const feedbackElement = parent.querySelector(".feedback")
                            // feedbackElement.textContent = feedbackCorrect;
                            // feedbackElement.style.fontSize = "3rem";
                            setTimeout( () => {jsPsych.finishTrial(trialData)},1000)
                            
                            
                        }

                        else{
                            trialData["Chosen_Canvas"] = chosenCanvasID;
                            trialData["Response_Correct"] = "false"
                            const chosenCanvas = document.querySelector(`#${chosenCanvasID}`)
                            console.log(document.querySelectorAll("canvas"))
                            drawFeedback(feedbackImgSource,false,chosenCanvas);
                            // const parent = chosenCanvas.parentElement
                            // const feedbackElement = parent.querySelector(".feedback")
                            // feedbackElement.textContent = feedbackIncorrect;
                            // feedbackElement.style.fontSize = "3rem";
                            setTimeout( () => {jsPsych.finishTrial(trialData)},1000)
                            
                        }


                    }, {once:true})
                    }},
                    post_trial_gap: 300,
            }
            trials.push(choice_trial)
        }
    })

    return trials
}


const csv = '../Graph_Matrices_Generation/sample_designfile.csv'



async function runExperiment(){
    const trials = await generateTrials(drawShapes,colourVals,textures,csv)
    console.log(trials);
    console.log(trials.length)
    timeline.push(...trials)
    jsPsych.run(timeline)
   
}

runExperiment()
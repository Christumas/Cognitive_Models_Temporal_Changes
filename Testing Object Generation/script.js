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


function drawRect(colour=null, texture=null){
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d')
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    const rectangleWidth = 200;
    const rectangleHeight = 200;

    const Xpos = (canvas_width/2) - (rectangleWidth/2) ;
    const Ypos = (canvas_height/2) - (rectangleHeight/2);

    context.rect(Xpos,Ypos,rectangleWidth,rectangleHeight);
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


function drawPlus(colour=null, texture=null){    
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
    
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
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

function drawTriangle(colour=null, texture=null){
    
    const paths = [
        [0,0],
        [60,-100],
        [120,0]
    ]

    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
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

function drawPacman(colour=null, texture=null){
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;


    const startX = canvas_width/2;  
    const startY = canvas_height/2;
    context.arc(startX,startY,100, 0, Math.PI*1.5, false)
    context.lineTo(startX,startY)
    context.closePath()
    context.fill()

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

function drawCircle(colour=null, texture=null){
   
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;


    const canvasCenterX = canvas_width/2;
    const canvasCenterY = canvas_height/2;
    context.arc(canvasCenterX,canvasCenterY,100, 0, Math.PI*2, false)
    context.fill()

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

function drawStar(colour=null, texture=null){

    const spikes = 5 
    const outerRadius = 100 
    const innerRadius = 50
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
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
        console.log("texture is present")
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


function drawHexagon(colour, texture){
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d');

    const size = 100; //basically radius because the hexagon will be drawn using a circle as reference
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


// const colore = "rgba(83, 233, 13, 0.65)"
// const t1 = 'Textures/texture_dots.png'

// let trial= {
//     type: jsPsychHtmlKeyboardResponse,
//     stimulus: `<div class="canvas-holder">
//     <canvas id="jspsych-canvas-keyboard-response-stimulus" width=500 height=500 style="border:2px solid black;"></canvas>
//     </div>`,
//     on_load: function(){
//         drawRect(colore,t1)
//     },
//     trial_duration: null

// }

const drawShapes = [
    drawCircle,
    drawHexagon,
    drawPacman,
    drawPlus,
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
    "Textures\\texture_bottle.png",
    "Textures\\texture_bricks.png",
    "Textures\\texture_dots.png",
    "Textures\\texture_flannel.png",
    "Textures\\texture_grid.png",
    "Textures\\texture_verticalLines.png",
    "Textures\\texture_waves.png"
]


function generateTrials(functionArray, colourdict, textureArray){
    const colours = Object.keys(colourdict)
    const trials = []

    if (functionArray.length == Object.keys(colourdict)["length"]){
        
        textureArray.forEach( (element, index) => {
            let a = Math.floor(Math.random() * functionArray.length);
            let b = Math.floor(Math.random() * functionArray.length);
            let c = Math.floor(Math.random() * functionArray.length);

            let colour = colourdict[colours[b]];
            let texture = textures[c];
            

            let trial = {
                type: jsPsychHtmlKeyboardResponse,
                stimulus: `
                <div class="canvas-holder">
                <canvas id="jspsych-canvas-keyboard-response-stimulus" width=500 height=500 "></canvas>
                </div>
                `,
                on_load: function(){
                    drawShapes[a](colour,texture)
                },
                trial_duration: 3000
            }

            trials.push(trial)

                    
        })

    }

    return trials
}


const trials = generateTrials(drawShapes,colourVals,textures);
timeline.push(...trials)

jsPsych.run(timeline)
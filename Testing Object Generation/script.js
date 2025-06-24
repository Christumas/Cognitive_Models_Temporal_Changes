const jsPsych = initJsPsych();
const timeline = []


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


function drawRect(){
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d')
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    const rectangleWidth = 200;
    const rectangleHeight = 200;

    const Xpos = (canvas_width/2) - (rectangleWidth/2) ;
    const Ypos = (canvas_height/2) - (rectangleHeight/2);

    context.fillStyle = "red";
    context.fillRect(Xpos,Ypos, rectangleWidth, rectangleHeight);
    

}


function drawPlus(){    
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
    context.fillStyle = "green";
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
    context.fill()

}

function drawTriangle(){
    
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

    context.fill()
}

function drawPacman(){
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

}

function drawCircle(){
   
    const canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;


    const canvasCenterX = canvas_width/2;
    const canvasCenterY = canvas_height/2;
    context.arc(canvasCenterX,canvasCenterY,100, 0, Math.PI*2, false)
    context.fill()

}

function drawStar(spikes=5, outerRadius=100, innerRadius=50){

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
    for (i=0; i<spikes; i++){
        x = centreX + Math.cos(rotation)*outerRadius
        y = centreY + Math.sin(rotation)*outerRadius
        context.lineTo(x,y)
        rotation += step;

        x = centreX + Math.cos(rotation)*innerRadius
        y = centreY + Math.sin(rotation)*innerRadius
        context.lineTo(x,y)
        rotation += step;
    }

    context.lineTo(centreX,centreY - outerRadius);
    context.closePath()
    context.stroke()

    context.save()
    context.clip()

}
function drawHexagon(){
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

    context.stroke()
}




let trial= {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div class="canvas-holder">
    <canvas id="jspsych-canvas-keyboard-response-stimulus" width=500 height=500 style="border:2px solid black;"></canvas>
    </div>`,
    on_load: drawHexagon,
    trial_duration: null

}

timeline.push(trial);
jsPsych.run(timeline)
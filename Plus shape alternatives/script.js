const jsPsych = initJsPsych();
const timeline = [];

function drawSemiCircle(colour=null,texture=null, c=null){
    let canvas
    if (c){
        document.querySelector(`${c}`)
    }

    else{
        canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus");
    }

    const context = canvas.getContext('2d');
    const canvas_width = canvas.clientWidth;
    const canvas_height = canvas.clientHeight;

    const startX = canvas_width / 2
    const startY = canvas_height / 2
    const radius = canvas_width / 4


    // arc(x, y, radius, startAngle, endAngle, counterclockwise)
    context.beginPath(startX,startY)
    context.arc(startX, startY,radius, Math.PI, 0, true)
    context.closePath()
    context.lineWidth = 4;
    context.stroke();
    context.fillStyle = colour;
    context.fill()

}


trial  = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus: `<div class="canvas-holder">
                <canvas id="jspsych-canvas-keyboard-response-stimulus" width=500 height=500 style="border:2px solid black;"></canvas>
                </div>`,
    on_load: function() {
        drawSemiCircle("rgb(189, 38, 38,0.5)")
    },
    

}

timeline.push(trial)


jsPsych.run(timeline)
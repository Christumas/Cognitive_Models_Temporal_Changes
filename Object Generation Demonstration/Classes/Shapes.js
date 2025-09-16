//Parent class
class Shape{
    constructor(color=null, texture=null, scale=1){
        this.color = color;
        this.texture = texture;
        this.scale = scale;
    }

    getCanvas(canvasID=null){
        let canvas;
        // canvas ? document.querySelector(`${canvasID}`): document.querySelector("#jspsych-canvas-keyboard-response-stimulus");
        if(!canvasID){
            canvas = document.querySelector("#jspsych-canvas-keyboard-response-stimulus")
        }
        else{
            canvas = document.querySelector(`#${canvasID}`);
        }

        return canvas;
    }

    applyColourandTexture(context){
        if (this.texture) {
        // console.log("texture is present")
        const img = new Image();
        img.src = this.texture;
        img.onload = () => {
            const pattern = context.createPattern(img, "repeat");
            context.fillStyle = pattern;
            context.fill();

            context.fillStyle = this.color;
            context.fill();
            context.restore();

            context.lineWidth = 3;
            context.stroke();
        };
        } else {
        console.log("Texture not present");
        context.lineWidth = 3;
        context.stroke();
        }
        }

    draw(context){
        throw new Error("This is a method just for the subclasses : Circle, Triangle, Semi-circle, Hexagon, Star, Square, Pacman")
    }

    static getBoundingBox(canvas,paths){
        let minX = Infinity,
        minY = Infinity; //left most edge of the box
        let maxX = -Infinity,
        maxY = -Infinity; //right most edge of the box

        

        paths.forEach(([x, y]) => {
        if (x < minX) {
            minX = x;
        }
        if (y < minY) {
            minY = y;
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y > maxY) {
            maxY = y;
        }
        });

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

        const boundingWidth = maxX - minX; //width of the shape aka bounding box
        const boundingHeight = maxY - minY; //height of the shape aka bounding box

        const canvasCenterX = canvasWidth / 2; //x position of the canvas element center
        const canvasCenterY = canvasHeight / 2; //y position of the canvas element center

        const boundingCenterX = minX + boundingWidth / 2; //x position of the bounding box center
        const boundingCenterY = minY + boundingHeight / 2; //y position of the bounding box center

        const offsetX = canvasCenterX - boundingCenterX;
        const offsetY = canvasCenterY - boundingCenterY;

        return [offsetX, offsetY];


    }

}

//Subclasses for all the different shapes
class Rectangle extends Shape {

    draw(c=null){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        const rectangleWidth = 100 * this.scale;
        const rectangleHeight = 100 * this.scale;

        const Xpos = canvas_width / 2 - rectangleWidth / 2;
        const Ypos = canvas_height / 2 - rectangleHeight / 2;

        context.rect(Xpos, Ypos, rectangleWidth, rectangleHeight);
        context.save();
        context.clip();

        this.applyColourandTexture(context);

    }

}


class Semicircle extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        const startX = canvas_width / 2;
        const startY = canvas_height / 2;
        const radius = 100 * this.scale;

        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        context.beginPath(startX, startY);
        context.arc(startX, startY, radius, Math.PI, 0, true);
        context.lineWidth = 4;
        context.closePath();
        context.stroke();

        this.applyColourandTexture(context);
    }   
}


class Circle extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        const canvasCenterX = canvas_width / 2;
        const canvasCenterY = canvas_height / 2;
        const radius = 100 * this.scale;
        context.arc(canvasCenterX, canvasCenterY, radius, 0, Math.PI * 2, false);
        context.fill();

        context.save();
        context.clip();

        this.applyColourandTexture(context);
    }
}

class Pacman extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        const startX = canvas_width / 2;
        const startY = canvas_height / 2;
        const radius = 100 * this.scale;
        context.beginPath();
        context.arc(startX, startY, radius, 0, Math.PI * 1.5, false);
        context.lineTo(startX, startY);
        context.closePath();
        context.fill();

        context.save();
        context.clip();

        this.applyColourandTexture(context);
    }
}

class Star extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c);
        const spikes = 5;
        const outerRadius = 100 * this.scale;
        const innerRadius = 50 * this.scale;
        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        let step = Math.PI / spikes;
        let rotation = (Math.PI / 2) * 3;
        let centreX = canvas_width / 2;
        let centreY = canvas_height / 2;

        context.beginPath();
        context.moveTo(centreX, centreY - outerRadius);
        for (let i = 0; i < spikes; i++) {
            var x = centreX + Math.cos(rotation) * outerRadius;
            var y = centreY + Math.sin(rotation) * outerRadius;
            context.lineTo(x, y);
            rotation += step;

            var x = centreX + Math.cos(rotation) * innerRadius;
            var y = centreY + Math.sin(rotation) * innerRadius;
            context.lineTo(x, y);
            rotation += step;
        }

        context.closePath();

        context.save();
        context.clip();

        this.applyColourandTexture(context);
    }
}


class Triangle extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c)
        const paths = [
        [0, 0],
        [60 * this.scale, -100 * this.scale],
        [120 * this.scale, 0 * this.scale],
        ];

        const context = canvas.getContext("2d");
        const canvas_width = canvas.clientWidth;
        const canvas_height = canvas.clientHeight;

        let [offsetX, offsetY] = Shape.getBoundingBox(canvas,paths);
        

        context.beginPath();
        paths.forEach(([dx, dy], index) => {
            const x = offsetX + dx;
            const y = offsetY + dy;
            
            if (index == 0) {
            context.moveTo(x, y);
            } else {
            context.lineTo(x, y);
            }
    });

    context.closePath();
    context.save();
    context.clip();

    this.applyColourandTexture(context);
    }
}

class Hexagon extends Shape{
    draw(c=null){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d");

        const size = 100 * this.scale; //basically radius because the hexagon will be drawn using a circle as reference
        const sides = 6; //how many sides the polygon should have

        const shapeCentreX = canvas.clientWidth / 2;
        const shapeCentreY = canvas.clientHeight / 2;

        context.moveTo(
            shapeCentreX + size * Math.cos(0),
            shapeCentreY + size * Math.sin(0)
        );

        for (let i = 1; i <= sides; i++) {
            context.lineTo(
            shapeCentreX + size * Math.cos((i * 2 * Math.PI) / sides),
            shapeCentreY + size * Math.sin((i * 2 * Math.PI) / sides)
            );
        }

        context.save();
        context.clip();
        this.applyColourandTexture(context);
    }
};

class Feedback extends Shape{
    draw(c, correctFeedback){
        const canvas = this.getCanvas(c);
        const context = canvas.getContext("2d")
        const imageSource = ["images/tick-circle-svgrepo-com.svg",
                            "images/cross-circle-svgrepo-com.svg",
                            ];
        let feedbackImage;
        if (correctFeedback) {
            feedbackImage = imageSource[0];
        } else {
            feedbackImage = imageSource[1];
        }

        const img = new Image();
        img.src = feedbackImage;
        img.onload = () => {
            context.drawImage(img, 0, 0, 115, 115);
        };

    }
};


import { rectangle, circle} from "./src/main";

let canvas;
let canvasContext;
let ballX = 75;
let ballY = 75;
let ballSpeedX = 15;
let ballSpeedY = 5;

let paddle1X = 250;
const PADDLE_HEIGHT = 10;
const PADDLE_THICKNESS = 100;
const PADDLE_GAP = 500 - PADDLE_HEIGHT;


const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_GAP = 2;
const BRICK_COLS = 10;
const BRICK_ROWS = 14;

const WINNING_SCORE = 3;
const COLLISION_SPEED = 2;
let endGame = true;

const background = (canvasContext) => {
    rectangle(canvasContext, {
        color: "black",
        posX: 0,
        posY: 0,
        height: canvas.height,
        width: canvas.width
    });
};

const leftPaddle = (canvasContext) => {
    rectangle(canvasContext, {
        color: "white",
        posX: paddle1X,
        posY: PADDLE_GAP,
        height: PADDLE_HEIGHT,
        width: PADDLE_THICKNESS
    });
};

const ball = (canvasContext) => {
    circle(canvasContext, {
        color: "white",
        posX: ballX,
        posY: ballY,
        radius: 10
    });
};

const drawBricks = (canvasContext) => {
    // BRICK_GAP
    for (let i = 0; i < BRICK_COLS; i++){
        for (let j = 0; j < BRICK_ROWS; j++){
            rectangle(canvasContext, {
                color: "blue",
                posX: BRICK_W * i,
                posY: BRICK_H * j,
                height: BRICK_H - BRICK_GAP,
                width: BRICK_W - BRICK_GAP
            });
        }
    }
}

const ballReset = () => {

    ballY = canvas.height / 2;
    ballX = canvas.width / 2;
    ballSpeedY = -5;
    ballSpeedX *= -1;

};


const drawEverything = (canvasContext) => {
    background(canvasContext);

    leftPaddle(canvasContext);
    ball(canvasContext);
    drawBricks(canvasContext);
};

const collisionPower = (paddlePosition, ballPosition) => {
    let collisionPoint = paddlePosition + (PADDLE_THICKNESS / 2);
    let cP = ((collisionPoint - ballPosition) / COLLISION_SPEED);

    return -cP;
};

const moveEverything = () => {

    /* bounce movement*/

    /*Right Bounds*/
    if (ballX > canvas.width){
            ballSpeedX *= -1;
    };

    /*Left Bounds*/
    if (ballX < 0){
        ballSpeedX *= -1;
    }

    /*Bottom bounds*/
    if (ballY > (PADDLE_GAP - PADDLE_HEIGHT)){

        if (ballX > paddle1X &&
            ballX < paddle1X + PADDLE_THICKNESS){

            ballSpeedX = collisionPower(paddle1X, ballX);
            ballSpeedY *= -1;
        } else {
            if (ballY > canvas.height){
                ballReset();
            }
        }
    };

    /*Top bounds*/
    if (ballY < 0){
        ballSpeedY *= -1;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
};

const calculateMousePos = (evt) => {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;

    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;

    return {
        x: mouseX,
        y: mouseY
    }
};

window.onload = () => {
    canvas = document.querySelector("#gameCanvas");
    canvasContext = canvas.getContext("2d");

    const fps = 30;


    canvas.addEventListener('mousemove', function(evt){
        let mousePos = calculateMousePos(evt);
        paddle1X = mousePos.x - (PADDLE_THICKNESS / 2);
    });

    setInterval( () => {
        moveEverything();
        drawEverything(canvasContext);
    }, 1000 / fps
    );
}
import { rectangle, circle, text} from "./main";

let canvas;
let canvasContext;
let ballX = 75;
let ballY = 75;
let ballSpeedX = 15;
let ballSpeedY = 5;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

let leftPlayerScore = 0;
let rightPlayerScore = 0;
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
        posX: 0,
        posY: paddle1Y,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH
    });
};

const rightPaddle = (canvasContext) => {
    rectangle(canvasContext, {
        color: "white",
        posX: canvas.width - PADDLE_WIDTH,
        posY: paddle2Y,
        height: PADDLE_HEIGHT,
        width: PADDLE_WIDTH
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

const leftScore = canvasContext =>{
    text(canvasContext, {
        color: "white",
        font: "bold 16px Arial",
        posX: 100,
        posY: 100,
        text: `Player 1: ${leftPlayerScore}`
    })
}

const rightScore = canvasContext =>{
    text(canvasContext, {
        color: "white",
        font: "bold 16px Arial",
        posX: canvas.width - 200,
        posY: 100,
        text: `Player 2: ${rightPlayerScore}`
    })
}


const ballReset = (winner) => {
    if (winner === "leftPlayer"){
        leftPlayerScore++;
    } else {
        rightPlayerScore++;
    }

    if (rightPlayerScore === WINNING_SCORE ||
        leftPlayerScore  === WINNING_SCORE
    ){
        endGame = true;
    } else {
        ballY = canvas.height / 2;
        ballX = canvas.width / 2;
        ballSpeedY = -5;
        ballSpeedX *= -1;
    }



};
const textBorder = (canvasContext) => {
    let gap = 30;
    let frames = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    let r = (Math.random() * 154);
    let g = (Math.random() * 254);
    let b = (Math.random() * 254);

    frames.map((row, rowIndex) => {
        row.map((column, colIndex) => {
            if (column === 1){
                rectangle(canvasContext, {
                    color: `rgb(${r},${g},${b})`,
                    posX: (canvas.width / 3.8) + (colIndex * gap),
                    posY: canvas.height / 2.3 + (rowIndex * gap),
                    height: 10,
                    width: 10
                });
            }
        });
    })
};


const finalResults = (canvasContext) => {
    background(canvasContext);
    textBorder(canvasContext);

    if (leftPlayerScore != 0 || rightPlayerScore != 0 ){
        canvasContext.textAlign = 'center';
        text(canvasContext, {
            color: "white",
            font: "bold 24px Arial",
            posX: (canvas.width / 2),
            posY: canvas.height / 2,
            text: `Player ${leftPlayerScore === WINNING_SCORE ? "1" : "2"} wins ! Press SPACE to continue`
        });
    } else {
        canvasContext.textAlign = 'center';
        text(canvasContext, {
            color: "white",
            font: "bold 24px Arial",
            posX: (canvas.width / 2),
            posY: canvas.height / 2,
            text: `PONG Press SPACE to start`
        });
    }

};

const dashedLine = (canvasContext) => {
    for (let i = 0; i < 20; i++){
        rectangle(canvasContext, {
            color: "white",
            posX: (canvas.width / 2) ,
            posY: (canvas.height / 20) * i,
            height: 20,
            width: 10
        });
    }
};

const drawEverything = (canvasContext) => {
    background(canvasContext);

    if (!endGame){
        leftPaddle(canvasContext);
        rightPaddle(canvasContext);
        ball(canvasContext);
        leftScore(canvasContext);
        rightScore(canvasContext);
        dashedLine(canvasContext);
    } else {
        finalResults(canvasContext);
    }


};

const collisionPower = (paddlePosition, ballPosition) => {
    let collisionPoint = paddlePosition + (PADDLE_HEIGHT / 2);
    let cP = ((collisionPoint - ballPosition) / COLLISION_SPEED);
    return -cP;
};

const moveComputerPaddle = () => {
    const speed = 0.81; // level from 0.81 to 0.9
    paddle2Y = (ballY - PADDLE_HEIGHT/2) * speed;
};

const moveEverything = () => {


    /*AI*/
    moveComputerPaddle();

    /* bounce movement*/

    /*Right Bounds*/
    if (ballX > canvas.width){
        if (ballY > paddle2Y &&
            ballY < paddle2Y + PADDLE_HEIGHT){
            ballSpeedY = collisionPower(paddle2Y, ballY);
            ballSpeedX *= -1;
        } else{
            ballReset("leftPlayer");
        }
    };

    /*Left Bounds*/
    if (ballX < 0){
        if (ballY > paddle1Y &&
            ballY < paddle1Y + PADDLE_HEIGHT){
            ballSpeedY = collisionPower(paddle1Y, ballY);
            ballSpeedX *= -1;
        }else{
            ballReset("rightPlayer");
        }
    }

    /*Bottom bounds*/
    if (ballY > canvas.height){
        ballSpeedY *= -1;
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
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });

    window.addEventListener('keydown', function(e) {
        if(e.keyCode === 32){

            endGame = false;

            leftPlayerScore = 0;
            rightPlayerScore = 0;
        };
    });

    setInterval( () => {
        if (!endGame){
            moveEverything();
            drawEverything(canvasContext);
        } else {
            finalResults(canvasContext);
        }
    }, 1000 / fps
    );
}
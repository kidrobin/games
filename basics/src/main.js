export const rectangle = (canvasContext, props) => {
    canvasContext.fillStyle = props.color;
    canvasContext.fillRect(props.posX, props.posY, props.width, props.height); // from top left corner
};

export const circle = (canvasContext, props) => {
    canvasContext.fillStyle = props.color;
    canvasContext.beginPath();
    canvasContext.arc(props.posX, props.posY, props.radius, 0,  Math.PI*2, true);
    canvasContext.fill();
};

export const text = (canvasContext, props) => {
    canvasContext.fillStyle = props.color;
    canvasContext.font = props.font;
    canvasContext.fillText(props.text, props.posX , props.posY);
}
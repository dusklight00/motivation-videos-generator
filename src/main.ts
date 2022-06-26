import CanvasWrapper from "./wrappers/canvas-two-wrapper";
import Two from "two.js";

const canvasWidth = 500;
const canvasHeight = 500;
const imagePath = "./image.png";

const canvas = new CanvasWrapper(canvasWidth, canvasHeight, imagePath);

const output = canvas.renderBase64();
console.log(output);

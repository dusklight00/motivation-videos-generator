import { createCanvas, Image, loadImage } from "canvas";
import Two from "two.js";
import fs from "fs";

class CanvasWrapper {
  canvas: any;
  two: Two;

  constructor(canvasWidth: number, canvasHeight: number, imagePath?: string) {
    this.canvas = createCanvas(canvasWidth, canvasHeight);
    Two.Utils.shim(this.canvas, Image);
    this.two = new Two({
      width: canvasWidth,
      height: canvasHeight,
      domElement: this.canvas,
    });
    this.two.render();

    if (imagePath) {
      loadImage(imagePath).then((image: any) => {
        this.canvas.getContext("2d").drawImage(image, 0, 0);
      });
    }
  }

  edit(canvasEditFunction: (two: Two) => void) {
    canvasEditFunction(this.two);
    this.two.update();
  }

  clear() {
    this.two.clear();
    this.two.update();
  }

  renderCanvasToHTML(htmlFilePath: string) {
    const image = this.canvas.toDataURL("image/png");
    const html = `<img src="${image}">`;
    fs.writeFileSync(htmlFilePath, html);
  }

  renderPNG(outputPath: string) {
    return new Promise<void | string>((resolve, reject) => {
      const out = fs.createWriteStream(outputPath);
      const stream = this.canvas.createPNGStream();
      stream.pipe(out);
      stream.on("end", () => {
        resolve();
      });
      stream.on("error", (err: any) => {
        reject(err.toString());
      });
    });
  }

  renderBase64() {
    return this.canvas.toDataURL("image/png");
  }
}

export default CanvasWrapper;

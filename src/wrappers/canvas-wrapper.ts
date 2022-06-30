import { createCanvas } from "canvas";
import fs from "fs";

class CanvasWrapper {
  canvas: any;
  isEditing: boolean = false;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvas = createCanvas(canvasWidth, canvasHeight);
  }

  async waitCompletEditing() {
    while (!this.isEditing) continue;
    return;
  }

  async edit(canvasEditFunction: (canvas: any) => void) {
    this.isEditing = true;
    await canvasEditFunction(this.canvas);
    this.isEditing = false;
  }

  async renderCanvasToHTML(htmlFilePath: string) {
    await this.waitCompletEditing();
    const image = this.canvas.toDataURL("image/png");
    const html = `<img src="${image}">`;
    fs.writeFileSync(htmlFilePath, html);
  }

  renderPNG(outputPath: string) {
    return new Promise<void | string>(async (resolve, reject) => {
      await this.waitCompletEditing();
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

  async renderBase64() {
    await this.waitCompletEditing();
    return this.canvas.toDataURL("image/png");
  }
}

export default CanvasWrapper;

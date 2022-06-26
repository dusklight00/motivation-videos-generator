import https from "https";
import fs from "fs";
import ProgressBar from "progress";

export function downloadFileStream(url: string, output: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const outputFileStream = fs.createWriteStream(output);
    https.get(url, (response) => {
      const contentLength = parseInt(response.headers["content-length"] ?? "0");
      const bar = new ProgressBar(
        "[*] Downloading... [:bar] :rate/bps :percent :etas",
        {
          total: contentLength,
        }
      );
      let data: Buffer;
      response.on("data", (chunk: Buffer) => {
        if (!data) {
          data = chunk;
        } else {
          data = Buffer.concat([data, chunk]);
        }
        bar.tick(chunk.length);
      });
      response.on("end", () => {
        outputFileStream.write(data);
        outputFileStream.end();
        resolve();
      });
      response.on("error", (error: Error) => {
        reject(error);
      });
    });
  });
}

export function fetch(url: string): Promise<{
  text: () => string;
  json: () => object;
}> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data: Buffer;
      response.on("data", (chunk: Buffer) => {
        if (!data) {
          data = chunk;
        } else {
          data = Buffer.concat([data, chunk]);
        }
      });
      response.on("end", () => {
        const responseObject = {
          text: (): string => data.toString(),
          json: (): object => JSON.parse(data.toString()),
        };
        resolve(responseObject);
      });
      response.on("error", (error: Error) => {
        reject(error);
      });
    });
  });
}
